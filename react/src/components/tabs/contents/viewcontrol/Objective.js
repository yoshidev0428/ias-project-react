import React, {useState, useEffect} from 'react';
import SmallCard from "../../../custom/SmallCard";
import ObjectiveButton from "../../../custom/ObjectiveButton";
export default function Objective(props) {

    const[activeButton, setActiveButton] = useState(0); //id

    const objectives = [
        { id: 0, m: 4, active: true },
        { id: 1, m: 10, active: false },
        { id: 2, m: 20, active: false },
        { id: 3, m: 40, active: false },
        { id: 4, m: 100, active: false }
    ];

    const handleClickButton = (e, id) => {
        setActiveButton(id);
        console.log("OBJECTIVE: handleClickButton ", id, e);
    }

    return (
        <SmallCard title="Objective">
            {
                objectives.map((item, i) => {
                    return <ObjectiveButton onClick={(e,id) => handleClickButton(e, id)} id={item.id} activeId={activeButton} label={item.m + 'X'} key={item.id} active={item.active} />;
                })
            }
        </SmallCard>
    );
};
