import { useEffect, useState } from 'react';
import { createLoader } from '@/helpers/avivator';
import { useExperimentStore } from '@/stores/useExperimentStore';

export default function useMetadata(urls, onLoading = () => void 0) {
  const { metadataMap, updateMetadataMap } = useExperimentStore();
  const [metadata, setMetadata] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      onLoading(true);

      const tiffs = await Promise.all(
        urls.map((url) => {
          if (metadataMap[url]) {
            return Promise.resolve([{ metadata: metadataMap[url] }]);
          }
          return createLoader(url);
        }),
      );
      const metadata = tiffs.map((data) =>
        data.length ? data[0].metadata : data.metadata,
      );
      const map = metadata.reduce(
        (acc, data, idx) => (data ? { ...acc, [urls[idx]]: data } : acc),
        {},
      );
      setMetadata(metadata.filter(Boolean));
      updateMetadataMap(map);
      setLoading(false);
      onLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urls, updateMetadataMap]);

  return [metadata, loading];
}
