import React, { useState, useCallback, useRef, useEffect } from 'react';
import FlowChart, { addNode, addBranch, expandBranch, combineNodes, deleteNode } from '../src';
import type { NodeData } from '../src';
import { Modal, Button, Toast } from 'react-customize-ui';
import RenderNode from './Node';
import { cloneDeep, uniqueId } from 'lodash-es';
import './FlowChartDemo.scss';
import { useI18n } from './App';
import type { ActionType } from './Node/Action';

let toastId: number | string;

function createNewNode(type: ActionType | 'temp' | 'condition') {
    return {
        id: uniqueId() + Date.now().toString(32),
        type
    };
}

const toastTransitions = {
    en: {
        action: 'Is the deletion of this node confirmed?',
        singleCondition: 'Is the deletion of this branch node confirmed?',
        allConditions: 'Is the deletion of this branch confirmed?'
    },
    zh: {
        action: '是否确认删除该节点？',
        singleCondition: '是否确认删除该分支节点？',
        allConditions: '是否确认删除该分支？'
    }
}

const ToastConfirmDelete: React.FC<{ type: 'action' | 'singleCondition' | 'allConditions', confirm: ()=> void; cancel: ()=> void; }> = ({ type, confirm, cancel }) => {
    const i18n = useI18n(toastTransitions);

    return (
        <div className='toast_container'>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{i18n[type]}</div>
            <Button color="#ff3b3b" variant="text" onClick={cancel}>Cancel</Button>
            <Button color="#1890ff" variant="contain" style={{ marginLeft: 12 }} onClick={confirm}>Confirm</Button>
        </div>
    )
}

const AddOperationPanel: React.FC<{ open: 'add' | 'combineNodes' | false; callback: (type: string) => void; }> = ({ open, callback }) => {

    return (
        <Modal open={!!open}>
            <div className='toast_container'>
                <div>
                    <Button color="#2196f3" style={{ width: 84, height: 80, margin: 16 }} onClick={() => callback('time')}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <svg style={{display: 'block'}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14455" width="40" height="40"><path d="M690.43953 332.921415 503.821225 519.578606 381.0736 396.825864c-8.740058-8.739035-22.946618-8.739035-31.686676 0-8.740058 8.741082-8.740058 22.948665 0 31.6877l122.753765 122.749672-35.180244 35.17922c-8.741082 8.741082-8.741082 22.949688 0 31.6877 8.739035 8.734942 22.942525 8.734942 31.68156 0l35.17922-35.17922 35.722596 35.716456c8.734942 8.738012 22.942525 8.738012 31.682583 0 8.740058-8.740058 8.740058-22.948665 0-31.68463l-35.716456-35.719526 186.612165-186.612165c8.740058-8.740058 8.740058-22.947641 0-31.6877C713.382055 324.180334 699.174472 324.180334 690.43953 332.921415L690.43953 332.921415zM510.544347 62.365396c-247.517303 0-448.158996 200.64067-448.158996 448.158996 0 247.517303 200.64067 448.16002 448.158996 448.16002 247.51935 0 448.161043-200.641693 448.161043-448.16002C958.70539 263.006066 758.063697 62.365396 510.544347 62.365396L510.544347 62.365396zM532.951683 912.39004 532.951683 801.826921c0-12.367679-10.037611-22.406313-22.407336-22.406313-12.368702 0-22.406313 10.038634-22.406313 22.406313l0 110.563118C284.718065 901.050784 119.031489 737.337141 108.453572 532.930705l110.789269 0c12.368702 0 22.406313-10.037611 22.406313-22.406313s-10.037611-22.406313-22.406313-22.406313L108.680746 488.11808c12.326746-202.973808 177.245843-368.076076 379.458311-379.595434l0 110.699218c0 12.368702 10.037611 22.406313 22.406313 22.406313 12.370749 0 22.407336-10.038634 22.407336-22.406313L532.952706 108.569718c202.258517 11.519358 367.177614 176.621627 379.505383 379.548362L801.847899 488.11808c-12.369725 0-22.406313 10.038634-22.406313 22.406313s10.037611 22.406313 22.406313 22.406313l110.789269 0C902.058229 737.337141 736.372675 901.050784 532.951683 912.39004L532.951683 912.39004zM532.951683 912.39004" p-id="14456" fill="#2196f3"></path></svg>
                            time
                        </div>
                    </Button>
                    <Button color="#f759ab" style={{ width: 84, height: 80, margin: 16 }} onClick={() => callback('write')}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <svg style={{display: 'block'}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15994" width="40" height="40"><path d="M343.207178 559.224558c-0.584308 0.74599-1.167592 1.523703-1.427512 2.465145l-45.016263 165.04394c-2.629897 9.608845 0.064468 19.961634 7.173376 27.262924 5.323239 5.192256 12.33391 8.049327 19.798928 8.049327 2.466168 0 4.932336-0.291642 7.366781-0.942465l163.873278-44.692898c0.261966 0 0.391926 0.228197 0.585331 0.228197 1.882883 0 3.733021-0.681522 5.129834-2.111081L938.887019 276.393981c13.016455-13.030781 20.156062-30.78412 20.156062-50.096978 0-21.892613-9.283434-43.767829-25.544793-59.98007l-41.382503-41.446971c-16.226566-16.261359-38.135552-25.560142-60.012815-25.560142-19.308765 0-37.063127 7.141654-50.113351 20.138666L343.855954 557.698808C343.403652 558.118364 343.532589 558.736441 343.207178 559.224558M896.010489 233.486752l-43.524283 43.493583-70.560032-71.681576 42.909276-42.908252c6.783497-6.815219 19.927865-5.824659 27.717272 1.995447l41.412179 41.447994c4.321422 4.317329 6.785543 10.061147 6.785543 15.740496C900.718721 226.234581 899.060965 230.453672 896.010489 233.486752M421.137061 566.105269l316.191382-316.211848 70.596871 71.730695L492.316194 637.21584 421.137061 566.105269zM363.525945 694.308139l22.849404-83.869153 60.953234 60.95528L363.525945 694.308139zM923.762553 407.114185c-16.585747 0-30.18651 13.486152-30.248931 30.29805l0 408.484392c0 21.421892-17.398252 38.819121-38.85289 38.819121L163.658895 884.715747c-21.420869 0-38.884612-17.396205-38.884612-38.819121L124.774283 179.170682c0-21.439288 17.46272-38.850843 38.884612-38.850843l445.046099 0c16.680914 0 30.218232-13.549597 30.218232-30.234605 0-16.649192-13.537318-30.216185-30.218232-30.216185L159.049924 79.869049c-52.222385 0-94.725408 42.470277-94.725408 94.725408l0 675.913187c0 52.254108 42.504046 94.709035 94.725408 94.709035l700.18601 0c52.258201 0 94.743828-42.453904 94.743828-94.709035L953.979762 437.217806C953.912224 420.600337 940.3483 407.114185 923.762553 407.114185" p-id="15995" fill="#f759ab"></path></svg>
                            write
                        </div>
                    </Button>
                    <Button color="#00ffff" style={{ width: 84, height: 80, margin: 16 }} onClick={() => callback('send')}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <svg style={{display: 'block'}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16939" width="40" height="40"><path d="M85.333333 896l896-384L85.333333 128v298.666667l640 85.333333-640 85.333333z" p-id="16940" fill="#00ffff"></path></svg>
                            send
                        </div>
                    </Button>
                    <Button color="#7e57c2" style={{ width: 84, height: 80, margin: 16 }} onClick={() => callback('audit')}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <svg style={{display: 'block'}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17692" width="40" height="40"><path d="M265.142857 212.571429c-5.028571 0-9.142857 4.114286-9.142857 9.142857v54.857143c0 5.028571 4.114286 9.142857 9.142857 9.142857h438.857143c5.028571 0 9.142857-4.114286 9.142857-9.142857v-54.857143c0-5.028571-4.114286-9.142857-9.142857-9.142857H265.142857z m210.285714 164.571428H265.142857c-5.028571 0-9.142857 4.114286-9.142857 9.142857v54.857143c0 5.028571 4.114286 9.142857 9.142857 9.142857h210.285714c5.028571 0 9.142857-4.114286 9.142858-9.142857v-54.857143c0-5.028571-4.114286-9.142857-9.142858-9.142857z m-54.857142 523.428572H164.571429V96h640v365.714286c0 5.028571 4.114286 9.142857 9.142857 9.142857h64c5.028571 0 9.142857-4.114286 9.142857-9.142857V50.285714c0-20.228571-16.342857-36.571429-36.571429-36.571428H118.857143c-20.228571 0-36.571429 16.342857-36.571429 36.571428v896c0 20.228571 16.342857 36.571429 36.571429 36.571429h301.714286c5.028571 0 9.142857-4.114286 9.142857-9.142857v-64c0-5.028571-4.114286-9.142857-9.142857-9.142857z m502.857142-100.571429H758.857143v-41.828571c52.914286-15.771429 91.428571-64.685714 91.428571-122.742858 0-70.742857-57.257143-128-128-128s-128 57.257143-128 128c0 57.942857 38.514286 106.971429 91.428572 122.742858V800H521.142857c-10.057143 0-18.285714 8.228571-18.285714 18.285714v173.714286c0 10.057143 8.228571 18.285714 18.285714 18.285714h402.285714c10.057143 0 18.285714-8.228571 18.285715-18.285714V818.285714c0-10.057143-8.228571-18.285714-18.285715-18.285714zM665.142857 635.428571c0-31.542857 25.6-57.142857 57.142857-57.142857s57.142857 25.6 57.142857 57.142857-25.6 57.142857-57.142857 57.142858-57.142857-25.6-57.142857-57.142858z m205.714286 304H573.714286v-68.571428h297.142857v68.571428z" p-id="17693" fill="#7e57c2"></path></svg>
                            audit
                        </div>
                    </Button>
                    <Button color="#ffa340" style={{ width: 84, height: 80, margin: 16 }} onClick={() => callback('record')}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <svg style={{display: 'block'}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18899" width="40" height="40"><path d="M822.857143 201.142857h-73.142857a18.285714 18.285714 0 1 1 0-36.571428H841.142857a18.285714 18.285714 0 0 1 18.285714 18.285714v694.857143a18.285714 18.285714 0 0 1-18.285714 18.285714H182.857143a18.285714 18.285714 0 0 1-18.285714-18.285714V182.857143a18.285714 18.285714 0 0 1 18.285714-18.285714h91.428571a18.285714 18.285714 0 0 1 0 36.571428h-73.142857v658.285714h621.714286v-658.285714zM365.714286 128h292.571428a18.285714 18.285714 0 0 1 18.285715 18.285714v109.714286a18.285714 18.285714 0 0 1-18.285715 18.285714h-292.571428a18.285714 18.285714 0 0 1-18.285715-18.285714V146.285714a18.285714 18.285714 0 0 1 18.285715-18.285714z m18.285714 36.571429v73.142857h256v-73.142857h-256z m-18.285714 365.714285a18.285714 18.285714 0 1 1 0-36.571428h292.571428a18.285714 18.285714 0 1 1 0 36.571428h-292.571428z m0 146.285715a18.285714 18.285714 0 1 1 0-36.571429h292.571428a18.285714 18.285714 0 1 1 0 36.571429h-292.571428z" p-id="18900" fill="#ffa340"></path></svg>
                            record
                        </div>
                    </Button>
                    {open === 'add' && 
                        <Button color="#8c8c8c" style={{ width: 84, height: 80, margin: 16 }} onClick={() => callback('addBranch')}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <svg style={{display: 'block'}} viewBox="0 0 1170 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23363" width="40" height="40"><path d="M619.556571 546.139429v139.940571c78.555429 15.817143 137.691429 84.681143 137.691429 167.259429C757.248 947.565714 680.192 1024 585.142857 1024s-172.105143-76.416-172.105143-170.660571c0-82.578286 59.136-151.442286 137.691429-167.259429v-139.940571H240.932571c-19.017143 0-34.413714 15.268571-34.413714 34.121142v105.819429c78.555429 15.817143 137.691429 84.681143 137.691429 167.259429C344.210286 947.565714 267.154286 1024 172.105143 1024S0 947.584 0 853.339429c0-82.578286 59.117714-151.442286 137.691429-167.259429v-105.819429c0-56.539429 46.226286-102.4 103.241142-102.4h309.796572V337.92c-78.555429-15.817143-137.691429-84.681143-137.691429-167.259429C413.037714 76.434286 490.093714 0 585.142857 0s172.105143 76.416 172.105143 170.660571c0 82.578286-59.136 151.442286-137.691429 167.259429v139.940571h309.796572c57.014857 0 103.259429 45.860571 103.259428 102.4v105.819429c78.555429 15.817143 137.673143 84.681143 137.673143 167.259429C1170.285714 947.565714 1093.229714 1024 998.180571 1024s-172.105143-76.416-172.105142-170.660571c0-82.578286 59.136-151.442286 137.691428-167.259429v-105.819429c0-18.834286-15.414857-34.121143-34.413714-34.121142H619.556571zM585.142857 273.060571c57.033143 0 103.259429-45.842286 103.259429-102.4 0-56.539429-46.226286-102.4-103.259429-102.4s-103.259429 45.860571-103.259428 102.4c0 56.557714 46.226286 102.4 103.259428 102.4zM172.105143 955.739429c57.033143 0 103.259429-45.860571 103.259428-102.4 0-56.557714-46.226286-102.4-103.259428-102.4s-103.259429 45.842286-103.259429 102.4c0 56.539429 46.226286 102.4 103.259429 102.4z m413.037714 0c57.033143 0 103.259429-45.860571 103.259429-102.4 0-56.557714-46.226286-102.4-103.259429-102.4s-103.259429 45.842286-103.259428 102.4c0 56.539429 46.226286 102.4 103.259428 102.4z m413.037714 0c57.033143 0 103.259429-45.860571 103.259429-102.4 0-56.557714-46.226286-102.4-103.259429-102.4s-103.259429 45.842286-103.259428 102.4c0 56.539429 46.226286 102.4 103.259428 102.4z" p-id="23364" fill="#8c8c8c"></path></svg>
                                branch
                            </div>
                        </Button>
                    }
                </div>
                <div>
                    <Button color="#ff3b3b" variant="text" onClick={() => callback('cancel')}>Cancel</Button>
                </div>
            </div>
        </Modal>

    );
};

const initData = {
    head: {
        id: 'head',
        next: ['tail'],
        type: 'start',
        title: '定时触发'
    },
    tail: {
        id: 'tail',
        pre: ['head'],
        type: 'end',
    }
}

const FlowChartDemo = () => {
    const [data, setData] = useState<Record<string, NodeData>>(initData);
    const [showAddPanel, setShowAddPanel] = useState<'add' | 'combineNodes' | false>(false);

    const dataRef = useRef(data);
    useEffect(() => {
        dataRef.current = cloneDeep(data);
    }, [data]);
    const tempNodeRef = useRef<NodeData | null>(null);

    const addTempNode = useCallback((type: 'add' | 'combineNodes', targetId: string | string[]) => {
        const newNode = createNewNode('temp');
        const newData = type === 'combineNodes' ? combineNodes(dataRef.current, targetId as  string[], newNode) : addNode(dataRef.current, targetId as string, newNode);
        setData(newData);
        tempNodeRef.current = newNode;
    }, []);


    const onHandleAdd = useCallback((nodeId: string) => {
        setShowAddPanel('add');
        addTempNode('add', nodeId);
    }, []);

    const onHandleCombineNodes = useCallback((nodesId: Array<string>) => {
        setShowAddPanel('combineNodes');
        addTempNode('combineNodes', nodesId);
    }, []);

    const addOperationCallback = useCallback((type: 'addBranch' | 'cancel' | string) => {
        if (!tempNodeRef.current) return;
        const operationTargetNodeId = tempNodeRef.current.pre![0];

        if (type === 'addBranch') {
            deleteNode(dataRef.current, tempNodeRef.current.id);
            addBranch(dataRef.current, operationTargetNodeId, [createNewNode('condition'), createNewNode('condition')]);
        } else if (type !== 'cancel') {
            dataRef.current[tempNodeRef.current.id].type = type;
        } else {
            deleteNode(dataRef.current, tempNodeRef.current.id);
        }
        setData(dataRef.current);
        setShowAddPanel(false);
        tempNodeRef.current = null;
    }, []);

    const onHandleExpandBranch = useCallback((nodeId: string) => {
        expandBranch(dataRef.current, nodeId, [createNewNode('condition')]);
        setData(dataRef.current);
    }, []);
    
    const onHandleDeleteNode = useCallback((nodeId: string) => {
        Toast.setListStyle({ left: '50%', top: '40%', transform: 'translate(-50%, -50%)'});
        const parentNode = dataRef.current[dataRef.current[nodeId].pre?.[0]!];
        const deleteType = parentNode.next?.length === 1 ? 'action' : parentNode.next?.length === 2 ? 'allConditions' : 'singleCondition';
        if (deleteType === 'allConditions') {
            parentNode.next?.forEach((nodeId) => {
                dataRef.current[nodeId].selected = true;
            });
        } else dataRef.current[nodeId].selected = true;
        setData({ ...dataRef.current });
        toastId = Toast.show({
            Content:
                <ToastConfirmDelete
                    type={deleteType}
                    confirm={() => {
                        if (deleteType === 'allConditions') {
                            parentNode.next?.forEach((nodeId) => {
                                deleteNode(dataRef.current, nodeId);
                            });
                        } else deleteNode(dataRef.current, nodeId);
                        setData({...dataRef.current});
                        Toast.hide(toastId);
                    }}
                    cancel={() => {
                        if (deleteType === 'allConditions') {
                            parentNode.next?.forEach((nodeId) => {
                                delete dataRef.current[nodeId].selected;
                            });
                        } else delete dataRef.current[nodeId].selected;
                        setData({...dataRef.current});
                        Toast.hide(toastId);
                    }}
                />,
            duration: 0,
            showMask: true
        });
    }, []);

    return (
        <div className="App">
            <div className="flowchart_container">
                <FlowChart
                    data={data}
                    onAdd={onHandleAdd}
                    onCombineNodes={onHandleCombineNodes}
                    onExpandBranch={onHandleExpandBranch}
                    onDeleteNode={onHandleDeleteNode}
                    styleConfig={{
                        backgroundColor: '#fff',
                        lineWidth: 1,
                        lineColor: '#ccc',
                        distance: { horizontal: 50, vertical: 40 },
                    }}
                    RenderNode={RenderNode}
                />
            </div>
            <AddOperationPanel open={showAddPanel} callback={addOperationCallback}/>
        </div>
    );
}


export default FlowChartDemo;