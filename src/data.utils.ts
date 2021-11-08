import { isEqual } from 'lodash-es';

interface NodeData {
    id: string;
    next?: string[];
    pre?: string[];
    [others: string]: any;
}

export const findHeadNodes = (data: Record<string, NodeData>) => {
    const headNodes: Array<NodeData> = [];
    for (const nodeId in data) {
        const node = data[nodeId];
        if (!node.pre && node.next)
            headNodes.push(node);
    }

    if (
        headNodes.length > 1
        && !headNodes.slice(1).every(node => isEqual(headNodes[0].next?.sort(), node.next?.sort()))
    ) {
        headNodes.length = 0;
    }
    return headNodes;
}

export function addNode(data: Record<string, NodeData>, targetId: string, newNode: NodeData) {
    const preNode = data[targetId];
    const nextNodes: Array<NodeData> = [];
    preNode.next!.forEach(nodeId => nextNodes.push(data[nodeId]));
    newNode.pre = [preNode.id];
    newNode.next = [...preNode.next!];
    preNode.next = [newNode.id];
    nextNodes.forEach(nextNode => {
        nextNode.pre = nextNode.pre!.filter(id => id !== preNode.id);
        nextNode.pre.push(newNode.id);
    });

    data[newNode.id] = newNode;
    return { ...data };
}

export function deleteNode(data: Record<string, NodeData>, targetId: string) {
    const targetNode = data[targetId];
    if (targetNode.pre!.length === 1 && data[targetNode.pre![0]].next!.length > 1) {
        const preNode = data[targetNode.pre![0]];
        const duplicate = {};
        const combineNode = getCombineNode(data, preNode.next!.map(nextId => data[nextId]), duplicate)!;
        preNode.next = preNode.next!.filter(nodeId => nodeId !== targetId);
        preNode.next = [...preNode.next, ...targetNode.next!].filter(id => id !== combineNode.id);
        targetNode.next!.forEach(nodeId => {
            if (nodeId !== combineNode.id) {
                data[nodeId].pre = data[nodeId].pre!.filter(id => id !== targetId);
                data[nodeId].pre = [...data[nodeId].pre!, preNode.id];
            } else combineNode.pre = combineNode.pre!.filter(id => id !== targetId);
        });
    } else {
        targetNode.pre!.forEach(nodeId => {
            data[nodeId].next = data[nodeId].next!.filter(id => id !== targetId);
            data[nodeId].next = [...data[nodeId].next!, ...targetNode.next!];
        });
        targetNode.next!.forEach(nodeId => {
            data[nodeId].pre = data[nodeId].pre!.filter(id => id !== targetId);
            data[nodeId].pre = [...data[nodeId].pre!, ...targetNode.pre!];
        });
    }
    delete data[targetId];
    return { ...data };
}

export function addBranch(data: Record<string, NodeData>, targetId: string, newNodes: Array<NodeData>) {
    const preNode = data[targetId];
    const nextNode = data[preNode.next![0]];
    newNodes.forEach(node => node.pre = [preNode.id])
    newNodes.forEach(node => node.next = [nextNode.id])
    preNode.next = newNodes.map(node => node.id);
    nextNode.pre = nextNode.pre!.filter(id => id !== preNode.id);
    nextNode.pre = [...nextNode.pre, ...newNodes.map(node => node.id)];
    newNodes.forEach(node => data[node.id] = node);
    return { ...data };
}

export const getCombineNode = (data: Record<string, NodeData>, branchNodes: Array<NodeData>, duplicate: Record<string, true>) => {
    const flag: Array<NodeData> = [];
    const searchNode = (node: NodeData) => {
        if (node.pre!.length > 1) {
            const target = flag.filter(flagNode => flagNode.id === node.id);
            if (target.length === 0) flag.push({ id: node.id, count: 1});
            else target[0].count ++;
        }
        if (node.next) searchNode(data[node.next[0]]);
    }
    branchNodes.forEach(node => searchNode(node));
    flag.sort((pre, next) => next.count - pre.count);
    if (duplicate[flag[0].id]) return null;
    duplicate[flag[0].id] = true;
    return data[flag[0].id] as NodeData;
}

export function expandBranch(data: Record<string, NodeData>, targetId: string, newNodes: Array<NodeData>) {
    const preNode = data[targetId];
    const duplicate = {};
    const combineNode = getCombineNode(data, preNode.next!.map(nextId => data[nextId]), duplicate)!;
    newNodes.forEach(node => node.pre = [preNode.id])
    newNodes.forEach(node => node.next = [combineNode!.id])
    preNode.next = [...preNode.next!, ...newNodes.map(node => node.id)];
    combineNode.pre = [...combineNode.pre!, ...newNodes.map(node => node.id)];
    newNodes.forEach(node => data[node.id] = node); 
}

export function combineNodes(data: Record<string, NodeData>, targetIds: Array<string>, newNode: NodeData) {
    const duplicate = {};
    const combineNode = getCombineNode(data, targetIds.map(id => data[id]), duplicate)!;
    const nodesNeedCombine: Array<NodeData> = [];
    combineNode.pre!.map(nodeId => data[nodeId]).forEach(node => {
        if (targetIds.includes(node.id)) nodesNeedCombine.push(node);
        else {
            let tempNode = node;
            while (tempNode.pre) {
                tempNode = data[tempNode.pre[0]];
                if (targetIds.includes(tempNode.id)) {
                    nodesNeedCombine.push(node);
                    break;
                }
            }
        }
    });
    nodesNeedCombine.map(node => node.next = [newNode.id]);
    newNode.next = [combineNode.id];
    newNode.pre = [...nodesNeedCombine.map(node => node.id)];
    combineNode.pre = [...combineNode.pre!.filter(id => !newNode.pre!.includes(id)), newNode.id];
    data[newNode.id] = newNode;
    return { ...data };
}