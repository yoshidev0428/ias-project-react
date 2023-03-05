const fs = (bound) => `
precision highp float;

uniform mat3 u_deblurKernel;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_gamma;

vec4 brightnessContrastGamma(vec4 color) {
  color.rgb += u_brightness;
  if (u_contrast > 0.0) {
    color.rgb = (color.rgb - 0.5) / (1.0 - u_contrast) + 0.5;
  } else {
    color.rgb = (color.rgb - 0.5) * (1.0 + u_contrast) + 0.5;
  }
  color.rgb = pow(color.rgb, vec3(u_gamma / 50.0));
  return color;
}

vec4 viv_sampleColor(sampler2D texture, vec2 texSize, vec2 texCoord) {
  vec4 color = vec4(0.0);
  

${
  bound <= 0
    ? `
  color = texture2D(texture, texCoord);
`
    : `
  vec3 sum = vec3(0.0);
  for (int i = -${bound}; i <= ${bound}; i++) {
    for (int j = -${bound}; j <= ${bound}; j++) {
      vec2 offset = vec2(float(i), float(j));
      sum += texture2D(texture, texCoord + offset).rgb * u_deblurKernel[i+${bound}][j+${bound}];
    }
  }
  color = vec4(sum, 1.0);
`
}
  return brightnessContrastGamma(color);
}
`;

const uniforms = {
  u_brightness: { value: 0, min: -1, max: 1 },
  u_contrast: { value: 0, min: -1, max: 1 },
  u_gamma: { value: 50, min: 0, max: 100 },
  u_deblurKernel: [],
};

const generateShaderModule = (bound) => ({
  name: 'viv',
  uniforms,
  fs: fs(bound),
  passes: [{ sampler: true }],
});

export default generateShaderModule;
