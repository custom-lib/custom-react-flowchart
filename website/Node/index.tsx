
import React from 'react';
import Action, { Props as ActionProps } from './Action';
import { Start, End } from './StartEnd';
import Condition  from './Condition';
import Temp  from './Temp';

interface Props {
    type: 'condition' | 'start' | 'end' | 'temp' | ActionProps['type'];
    [others: string]: any;
}


const RenderNode: React.FC<Props> = (props) => {
    if (props.type === 'condition') return <Condition {...props} />
    else if (props.type === 'start') return <Start {...props} />
    else if (props.type === 'end') return <End {...props} />
    else if (props.type === 'temp') return <Temp {...props} />;
    else return <Action {...props} type={props.type} />;
}

export default RenderNode;