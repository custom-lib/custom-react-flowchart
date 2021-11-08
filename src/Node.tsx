import React, { useContext, useMemo, useCallback, isValidElement } from 'react';
import { Context } from './index';
import Section from './Section';
import type { NodeData } from './index';
import './Node.scss';

interface Props {
    nodeData: NodeData;
    isHeadSection: boolean;
    isTailSection: boolean;
    isHeadNode: boolean;
    isTailNode: boolean;
    isBranchNode: boolean;
}

const Node: React.FC<Props> = ({ nodeData, isHeadSection, isTailSection, isHeadNode, isTailNode, isBranchNode }) => {
    const { id, ...nodeProps } = nodeData;
    const {
        data,
        showBranchButton,
        showAddButton,
        RenderBranchButton,
        RenderAddButton,
        RenderNode,
        styleConfig: { lineWidth, lineColor, backgroundColor, distance },
        onAdd,
        onExpandBranch,
        onDeleteNode
    } = useContext(Context);
    
    const nextSectionData = useMemo(() => nodeData.next?.map(nodeId => data[nodeId]).filter(node => node.pre?.length === 1), [data, nodeData]);

    const onClickAdd = useCallback(() => {
        onAdd?.(nodeData.id);
    }, [nodeData]);

    const onClickExpandBranch = useCallback(() => {
        onExpandBranch?.(nodeData.id);
    }, [nodeData]);

    const onClickDeleteNode = useCallback(() => {
        onDeleteNode?.(nodeData.id);
    }, [nodeData]);

    return (
        <div className="flowchart__node__wrapper" style={{ margin: `0 0 0 ${isHeadNode ? 0 : distance.horizontal}px` }}>
            {isBranchNode && (isHeadNode || isTailNode) &&
                Array.from({ length: 2 }, (_, index) => 
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            width: `calc(50% - ${lineWidth}px)`,
                            height: lineWidth,
                            backgroundColor,
                            boxShadow: `${lineWidth * (isHeadNode ? .6 : -.6)}px 0 0 0 ${backgroundColor}`,
                            zIndex: 1,
                            ...(isHeadNode ? { left: 0 } : { right: 0 }),
                            ...(index === 0 ? { top: 0 } : { bottom: 0 })
                        }}
                    />
                )
            }
            {nodeData.next &&
                <div
                    style={{
                        position: "absolute",
                        width: lineWidth,
                        height: '100%',
                        backgroundColor: lineColor,
                        transform: 'scale(1.001)'
                    }}
                /> 
            } 
            {!isHeadSection && nodeData.pre?.length === 1 &&
                <div
                    style={{
                        width: lineWidth,
                        height: distance.vertical,
                        backgroundColor: lineColor,
                        transform: 'scale(1.001)'
                    }}
                />
            }
            <div className="flowchart__node__box">
                <div
                    style={{
                        position: "absolute",
                        width: lineWidth,
                        height: '100%',
                        backgroundColor: lineColor,
                        transform: 'scale(1.001)' }}
                />

                {showBranchButton && nodeData.next && nodeData.next.length > 1 &&
                    <div
                        className="flowchart__operateButton"
                        style={{ bottom: `${-2 * distance.vertical}px` }}
                        onClick={onClickExpandBranch}
                    >
                        {typeof RenderBranchButton === 'function' ? <RenderBranchButton />
                            : isValidElement(RenderBranchButton) ? RenderBranchButton
                            : <svg style={{backgroundColor}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32951" width="24" height="24"><path d="M682.666667 955.733333H170.666667c-66.030933 0-102.4-36.369067-102.4-102.4V341.333333c0-66.030933 36.369067-102.4 102.4-102.4h68.266666v-68.266666c0-66.030933 36.369067-102.4 102.4-102.4h512c66.030933 0 102.4 36.369067 102.4 102.4v512c0 66.030933-36.369067 102.4-102.4 102.4h-68.266666v68.266666c0 66.030933-36.369067 102.4-102.4 102.4zM170.666667 273.066667c-47.223467 0-68.266667 21.0432-68.266667 68.266666v512c0 47.223467 21.0432 68.266667 68.266667 68.266667h512c47.223467 0 68.266667-21.0432 68.266666-68.266667v-68.266666H341.333333c-66.030933 0-102.4-36.369067-102.4-102.4V273.066667h-68.266666z m597.333333 477.866666h85.333333c47.223467 0 68.266667-21.0432 68.266667-68.266666V170.666667c0-47.223467-21.0432-68.266667-68.266667-68.266667H341.333333c-47.223467 0-68.266667 21.0432-68.266666 68.266667v512c0 47.223467 21.0432 68.266667 68.266666 68.266666h426.666667z" p-id="32952" fill="#1890ff"></path><path d="M597.333333 631.466667a34.133333 34.133333 0 0 1-34.133333-34.133334v-136.533333h-136.533333a34.133333 34.133333 0 0 1 0-68.266667h136.533333v-136.533333a34.133333 34.133333 0 0 1 68.266667 0v136.533333h136.533333a34.133333 34.133333 0 0 1 0 68.266667h-136.533333v136.533333a34.133333 34.133333 0 0 1-34.133334 34.133334z" fill="#1890ff"></path></svg>
                        }
                    </div>
                }
                
                <div style={{ position: 'relative' }}> 
                    {showAddButton && !isTailSection &&
                        <div
                            className="flowchart__operateButton"
                            style={{ bottom: `${-distance.vertical}px` }}
                            onClick={onClickAdd}
                        >
                            {typeof RenderAddButton === 'function' ? <RenderAddButton />
                                : isValidElement(RenderAddButton) ? RenderAddButton
                                : <svg style={{backgroundColor}} fill="#ffc53d" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="33378" width="24" height="24"><path d="M512 0C229.376 0 0 229.376 0 512s229.376 512 512 512 512-229.376 512-512S794.624 0 512 0z m238.08 570.88h-179.2v179.2c0 32.768-26.112 58.88-58.88 58.88s-58.88-26.112-58.88-58.88v-179.2h-179.2c-32.768 0-58.88-26.112-58.88-58.88s26.112-58.88 58.88-58.88h179.2v-179.2c0-32.768 26.112-58.88 58.88-58.88s58.88 26.112 58.88 58.88v179.2h179.2c32.768 0 58.88 26.112 58.88 58.88s-26.112 58.88-58.88 58.88z"></path></svg>
                            }
                        </div>
                    }
                    {typeof RenderNode === 'function' ?
                        <RenderNode
                            id={id}
                            onClickAdd={onClickAdd}
                            onClickDeleteNode={onClickDeleteNode}
                            canAddBranch={nodeData.next && nodeData.next.length === 1}
                            canDelete={nodeData.pre && nodeData.next && !(nodeData.pre.length > 1 && nodeData.next.length > 1)}
                            {...nodeProps}
                        /> : RenderNode
                    }
                </div>
            </div>
            {!isTailSection &&
                <div
                    style={{
                        width: lineWidth,
                        height: distance.vertical * (nodeData.next?.length === 1 && data[nodeData.next[0]]?.pre?.length === 1 ? 1 : 2),
                        backgroundColor: lineColor,
                        transform: 'scale(1.001)'
                    }}
                />
            }
            {nextSectionData && nextSectionData.length > 0 && <Section nodes={nextSectionData} />}
        </div>
    );
};


export default Node;