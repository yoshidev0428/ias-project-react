import React from 'react'
import SmallCard from "../../../custom/SmallCard"
import CustomButton from "../../../custom/CustomButton"
import {
    mdiLightbulbOutline,
    mdiLightbulb,
    mdiGestureTap,
    mdiLayersTriple,
    mdiGestureTapButton, mdiPlayCircleOutline,
    mdiTrashCanOutline, mdiCreation, mdiHandPointingUp,mdiKeyboardReturn,
    mdiSquareRoundedOutline,
    mdiPaletteOutline,
    mdiPaletteSwatchOutline,
    mdiCog
} from '@mdi/js';
import Icon from '@mdi/react';

export default function ObjectSelect() {

    const onLight = () => {
        console.log("Light")
    }
    const onBlack = () => {
        console.log("Black")
    }
    const onObject = () => {
        console.log("Object")
    }
    const onArea = () => {
        console.log("Area")
    }
    const onBack = () => {
        console.log("Back")
    }
    const onSet = () => {
        console.log("Set")
    }
    const onAuto = () => {
        console.log("Auto")
    }
    const onAdd = () => {
        console.log("Add")
    }
    const onErase = () => {
        console.log("Erase")
    }
    const onColor = () => {
        console.log("onColor")
    }
    const onInt = () => {
        console.log("onInt")
    }

    return (
        <div className='common-border'>
            <h6>Object Select</h6>
            <SmallCard title="Object brightness" child={true} className="mb-2">
                <button className="btn btn-light btn-sm w-50" onClick={onLight}>
                    <Icon size={0.8}
                        horizontal
                        vertical
                        rotate={180}
                        color="#212529"
                        path={mdiLightbulbOutline}>
                    </Icon>LightOB
                </button>
                <button className="btn btn-light btn-sm w-50" onClick={onBlack}>
                    <Icon size={0.8}
                        horizontal
                        vertical
                        rotate={180}
                        color="#212529"
                        path={mdiLightbulb}>
                    </Icon>BlackOB
                </button>
            </SmallCard>
            <SmallCard title="Select target" child={true}>
            <button className="btn btn-light btn-sm w-25" onClick={onObject}>
                    <Icon size={0.7}
                        horizontal
                        vertical
                        rotate={180}
                        color="#212529"
                        path={mdiGestureTap}>
                    </Icon>OB
                </button>
                <button className="btn btn-light btn-sm w-25" onClick={onArea}>
                    <Icon size={0.7}
                        horizontal
                        vertical
                        rotate={180}
                        color="#212529"
                        path={mdiLayersTriple}>
                    </Icon>Area
                </button>
                <button className="btn btn-light btn-sm w-25" onClick={onBack}>
                    <Icon size={0.7}
                        horizontal
                        vertical
                        rotate={180}
                        color="#212529"
                        path={mdiKeyboardReturn}>
                    </Icon>Bk
                </button>
                <button className="btn btn-light btn-sm w-25" onClick={onSet}>
                    <Icon size={0.6}
                        horizontal
                        vertical
                        rotate={180}
                        color="#212529"
                        path={mdiPlayCircleOutline}>
                    </Icon>Set
                </button>
            </SmallCard>

            <SmallCard title="ObjectClass" child={true}>
                <button className="btn btn-light btn-sm w-33" onClick={onAuto}>
                    <Icon size={0.6}
                          horizontal
                          vertical
                          rotate={180}
                          color="#212529"
                          path={mdiCreation}>
                    </Icon>Auto
                </button>
                <button className="btn btn-light btn-sm w-34" onClick={onAdd}>
                    <Icon size={0.6}
                          horizontal
                          vertical
                          rotate={180}
                          color="#212529"
                          path={mdiHandPointingUp}>
                    </Icon>Add
                </button>
                <button className="btn btn-light btn-sm w-33" onClick={onErase}>
                    <Icon size={0.6}
                          horizontal
                          vertical
                          rotate={180}
                          color="#212529"
                          path={mdiTrashCanOutline}>
                    </Icon>Erase
                </button>
            </SmallCard>

            <SmallCard title="Class & Object Status">
                <CustomButton icon={mdiSquareRoundedOutline} label="Area" onClick={() => onArea} />
                <CustomButton icon={mdiPaletteOutline} label="Color" onClick={() => onColor()} />
                <CustomButton icon={mdiPaletteSwatchOutline} label="Int" onClick={() => onInt()} />
                <CustomButton icon={mdiCog} label="Set" onClick={() => onSet} />
            </SmallCard>
        </div>
    )
}