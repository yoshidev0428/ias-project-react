import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Card from '@mui/material/Card';
import CustomButton from "../../../custom/CustomButton";
import Divider from '@mui/material/Divider';
import Slider from '@mui/material/Slider';

export const ImageSeries = (props) => {

    const onChange = (e) => {
        console.log(e);
    }

    return (
        <Card>
            <div>
                <h5>Series</h5>
                <div>
                    <Divider />
                    <CustomButton label="Reset" />
                </div>
            </div>
            <div>
                <Slider aria-label="always"  onChange={onChange} />
            </div>
        </Card>
    );
}