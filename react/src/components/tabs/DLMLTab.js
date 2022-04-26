import React from 'react';
import TabItem from '../custom/TabItem';
import Judge from "./contents/dlml/Judge";
import MethodSelect from "./contents/dlml/MethodSelect";
import BoxSelect from "./contents/dlml/BoxSelect";
import ObjectSelect from "./contents/dlml/ObjectSelect";
import ObjectClass from "./contents/dlml/ObjectClass";
import ClassObjectStatus from "./contents/dlml/ClassObjectStatus";
import MethodSelect2 from "./contents/dlml/MethodSelect2";
import BoxSelect2 from "./contents/dlml/BoxSelect2";
import ObjectSelect2 from "./contents/dlml/ObjectSelect2";
import Count from "./contents/dlml/Count";
import ObjectClass2 from "./contents/dlml/ObjectClass2";
import ClassObjectStatus2 from "./contents/dlml/ClassObjectStatus2";
import ExpansionPanel from "../custom/ExpansionPanel";
import { Divider } from 'semantic-ui-react';

export default function DLMLTab() {
    const refresh = () => {
        console.log("click refresh");
    };
    const help = () => {
        console.log("click help");
    };

    return (
        <TabItem title="Learning" buttons={true} refresh={refresh} help={help}>
            <ExpansionPanel title="Deep Learning">
                <Judge />
                <Divider />
                <MethodSelect />
                <Divider />
                <BoxSelect />
                <Divider />
                <ObjectSelect />
                <Divider />
                <ObjectClass />
                <Divider />
                <ClassObjectStatus />
            </ExpansionPanel>
            <ExpansionPanel title="Machine Learning">
                <MethodSelect2 />
                <Divider />
                <BoxSelect2 />
                <Divider />
                <ObjectSelect2 />
                <Divider />
                <Count />
                <Divider />
                <ObjectClass2 />
                <Divider />
                <ClassObjectStatus2 />
            </ExpansionPanel>
        </TabItem>
    );
};
