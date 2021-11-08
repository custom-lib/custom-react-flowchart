import React, { createContext, useRef, useEffect, useMemo, MutableRefObject } from 'react';
import { findHeadNodes } from './data.utils';
import Section from './Section';
import './index.scss';

type OverWrite<T, U> = Omit<T, keyof U> & U;

export const Context = createContext<OverWrite<Props, { styleConfig: StyleConfig; } > & { nextSectionDuplicate: MutableRefObject<Record<string, true>>; }>(null!);

export interface NodeData {
    id: string;
    next?: string[];
    pre?: string[];
    [others: string]: any;
}

interface StyleConfig  {
    backgroundColor: string;
    lineWidth: number;
    lineColor: string;
    distance: { horizontal: number, vertical: number };
}

export interface Props {
    data: Record<string, NodeData>;
    styleConfig?: Partial<StyleConfig>;
    showAddButton?: boolean;
    showBranchButton?: boolean;
    showCombineButton?: boolean;
    RenderNode?: React.ReactNode;
    RenderAddButton?: React.ReactNode;
    RenderBranchButton?: React.ReactNode;
    RenderCombineButton?: React.ReactNode;
    onAdd?(nodeId: string): void;
    onExpandBranch?(nodeId: string): void;
    onCombineNodes?(nodesId: Array<string>): void;
    onDeleteNode?(nodeId: string): void;
}


const defaultStyleConfig = {
    backgroundColor: '#fff',
    lineWidth: 1,
    lineColor: '#ccc',
    distance: { horizontal: 50, vertical: 40 },
} as const;


const FlowChart: React.FC<Props> = ({ styleConfig: _styleConfig, ...props }) => {
    const headNodes = useMemo(() => findHeadNodes(props.data), [props.data]);
    const styleConfig = useMemo(() => ({ ...defaultStyleConfig, ..._styleConfig }), [_styleConfig])!;
    
    const nextSectionDuplicate = useRef({});
    useEffect(() => {
        nextSectionDuplicate.current = {};
    }, [props.data]);
    
    return (
        <Context.Provider value={{ nextSectionDuplicate, styleConfig, ...props }}>
            <div className="flowchart__wrapper">
                <Section nodes={headNodes} />
            </div>
        </Context.Provider>
    );
}


FlowChart.defaultProps = {
    showAddButton: true,
    showBranchButton: true,
    showCombineButton: true,
}


export default FlowChart;

export * from './data.utils';