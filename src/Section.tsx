import React, { useContext, useMemo, useCallback, useRef, isValidElement } from 'react';
import { getCombineNode } from './data.utils';
import { Context } from './index';
import Node from './Node';
import type { NodeData } from './index';
import './Section.scss';

interface Props {
    nodes: Array<NodeData>;
}

const Section: React.FC<Props> = ({ nodes }) => {
    const {
        data,
        showCombineButton,
        nextSectionDuplicate,
        styleConfig: { lineWidth, lineColor, backgroundColor, distance },
        RenderCombineButton,
        onCombineNodes
    } = useContext(Context);

    const isHeadSection = useMemo(() => !nodes[0].pre, [nodes]);
    const isTailSection = useMemo(() => !nodes[0].next, [nodes]);
    const nextSectionData = useMemo(() => {
        const combineNode = nodes.length > 1 ? getCombineNode(data, nodes, nextSectionDuplicate.current) : null;
        return combineNode ? [combineNode] : null;
    }, [data, nodes, nextSectionDuplicate.current]);
    
    const onClickCombineNodes = useCallback(() => {
        onCombineNodes?.(nodes.map(node => node.id));
    }, [nodes]);

    return (
        <>
            <div
                className="flowchart__section__wrapper"
                style={{
                    backgroundColor,
                    margin: isHeadSection ? '0 auto' : 'unset',
                }}
            >
                {nodes?.map((nodeData, index) =>
                    <Node
                        key={nodeData.id}
                        nodeData={nodeData}
                        isHeadSection={isHeadSection}
                        isTailSection={isTailSection}
                        isBranchNode={nodes.length > 1}
                        isHeadNode={index === 0}
                        isTailNode={index === nodes.length - 1}
                    />
                )}
                {!isHeadSection && !isHeadSection && nodes?.length > 1 &&
                    Array.from({ length: 2 }, (_, index) => 
                        <div
                            key={index}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: lineWidth,
                                backgroundColor: lineColor,
                                ...(index === 0 ? { top: 0 } : { bottom: 0 })
                            }}/>
                    )
                }
                {showCombineButton && nodes.length > 1 &&
                    <div
                        className="flowchart__operateButton"
                        style={{ bottom: `${-distance.vertical}px` }}
                        onClick={onClickCombineNodes}
                    >
                        {typeof RenderCombineButton === 'function' ? <RenderCombineButton />
                            : isValidElement(RenderCombineButton) ? RenderCombineButton
                            : <svg style={{ backgroundColor }} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="31396" width="24" height="24"><path d="M859.859128 62.037938 163.077657 62.037938c-54.776557 0-99.540064 44.89142-99.540064 99.714026l0 698.001251c0 54.822606 44.76453 99.713003 99.540064 99.713003l696.78147 0c54.775534 0 99.539041-44.890396 99.539041-99.713003L959.398168 161.751964C959.399191 106.928335 914.635685 62.037938 859.859128 62.037938zM760.319064 560.608068 561.238936 560.608068l0 199.430098L461.698872 760.038166 461.698872 560.608068 262.617721 560.608068l0-99.714026L461.698872 460.894042 461.698872 261.46599l99.540064 0 0 199.428052 199.080128 0L760.319064 560.608068z" fill="#BC8F8F"></path></svg>
                        }
                    </div>
                }
            </div>
            {nodes.length > 1 && <div style={{ width: lineWidth, height: distance.vertical * 2, backgroundColor: lineColor }} />}
            {nextSectionData && nextSectionData?.length > 0 && <Section nodes={nextSectionData} />}
        </>
    );
}


export default Section;