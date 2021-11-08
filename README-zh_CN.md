custom-react-flowchart
=========================

中文 | [English](https://github.com/custom-lib/custom-react-flowchart/blob/main/READM.md)

**[Demo](https://custom-lib.github.io/custom-react-flowchart/)**

* 完全**基于DOM**的自动排布流程图组件。(虽然不像**canvas**的实现那样可以自由拖拽，但是也保留了DOM的渲染与事件能力。)
* 高可定制化。
* 很轻量，未压缩前14.5kb，压缩后3.6kb（gzip）。

我也不知道有什么用。我觉得就算它能在什么地方被使用，那也是很场景化定制化的。所以比起在文档里以一个组件的角度介绍它，我更倾向于讲讲实现思路。
有任何建议或者自带场景的问题，欢迎在issue里讨论或者加底部的群一起探讨。

## 实现思路

### data的结构

```javascript
interface NodeData {
    id: string;
    next?: string[];
    pre?: string[];

    [others: string]: any;
}

const data: Record<string, NodeData> = {
    head: {
        id: 'head',
        next: ['tail'],

        type: 'start',
    },
    tail: {
        id: 'tail',
        pre: ['head'],

        type: 'end',
    }
}
```

data 是个链式的对象，头结点没有 pre， 尾结点没有 next。

### 组件的结构

组件结构有两种，Section 和 Node，它们是互相引用，互相嵌套的关系。
每个 Section 是一组兄弟节点的包裹容器。每个 Node 是一个节点的渲染容器。
如果一个 Section 处产生了分支，即它包含的 Node 数量 >= 2，它还会包含 分支收束节点 的 Section。
如果一个 Node 代表的那个节点有后继，并且 后继节点不是 分支收束节点，那么这个 Node 还会包含含有后继节点的 Section。

```javascript
function Section() {
    return (
        <>
            {nodes.map(node =>
                <Node {...node} />
            )}
            {isBranchSection &&
                <Section {...combineNode} />
            }   
        </>
    );
}

function Node() {
    return (
        <>
            <NodeRender />
            {nextNode && nextNodeNotCombineNode &&
                <Section {...nextNode} />
            }   
        </>
    );
}
```

下图每个黑色框的区域是一个 Section 组件。
![image](https://github.com/custom-lib/custom-react-flowchart/blob/main/website/assets/Section.png)

下图每个红色框的区域是一个 Node 组件。
![image](https://github.com/custom-lib/custom-react-flowchart/blob/main/website/assets/Node.png)

**这样的嵌套结构也带来了一个问题：dev环境下使用需要关掉Strict Mode。Strict Mode下hooks会挂载到不正确的组件。**

### 连线是怎么画的？

纵向的线比较简单，利用预设高度以及DOM的高度放在 Section、Node 的中间就行了。
分支节点产生的横向连线归属于 Section，头尾的 Node 上需要用背景色的同样粗细的线去掩盖，如下图。
![image](https://github.com/custom-lib/custom-react-flowchart/blob/main/website/assets/Line.png)

线有很多，如果你不摸准用途，调试代码的时候注释掉看看会发生什么变化就行。

### Add、Branch和Combine按钮 以及 onDeleteNode

上面说明了流程图是如何布局排列的。
作为一个可交互的流程图，还需要有按钮来点击增加节点。以下这三种按钮是我觉得流程图必有的，和想渲染什么样的节点关系不大的，于是预设在了组件里。
分别是：

* 归属于某一个 Node 的 Add按钮，点击触发 onAdd 回调。
* 用于添加分支的 Branch按钮，点击触发 onExpandBranch 回调。
* 用于添加分支合并节点的 Combine按钮，点击触发 onCombineNodes 回调。

用于删除节点的按钮没有做预设，节点的自定义渲染函数中会拿到 onDeleteNode 这个回调。

```javascript
interface Callback {
    onAdd(nodeId: string): void;
    onExpandBranch(nodeId: string): void;
    onCombineNodes(nodesId: Array<string>): void;
    onDeleteNode(nodeId: string): void;
}
```

![image](https://github.com/custom-lib/custom-react-flowchart/blob/main/website/assets/Button.png)

## 引入

```bash
npm install --save custom-react-flowchart
```

```javascript
// 然后导入样式
import 'custom-react-flowchart/dist/style.css';
```

## 基础用法

想要使用这个流程图，首先需要一个符合规则的 data 数据源，然后定义好三种按钮操作的回调。
然后写个节点渲染函数 RenderNode，RenderNode 函数会接收到删除操作的回调函数 onDeleteNode。删除按钮就得自己写在 RenderNode里了。

custom-react-flowchart 只管布局，不管怎么操作数据，只要 data 是符合规则的就行。
当然也提供了一套操作数据的方法，具体可以看[demo的代码](https://github.com/custom-lib/custom-react-flowchart/blob/main/READM.md)。

```javascript
function flowchart () {
    const [data, setData] = useState({
        head: {
            id: 'head',
            next: ['tail'],

            type: 'start',
        },
        tail: {
            id: 'tail',
            pre: ['head'],

            type: 'end',
        }
    });

    return (
        <FlowChart
            data={data}
            onAdd={onHandleAdd}
            onCombineNodes={onHandleCombineNodes}
            onExpandBranch={onHandleExpandBranch}
            styleConfig={{
                backgroundColor: '#fff',
                lineWidth: 1,
                lineColor: '#ccc',
                distance: { horizontal: 50, vertical: 40 },
            }}
            RenderNode={RenderNode}
            onDeleteNode={onHandleDeleteNode}
        />
    );
}
```

### Props

**data (required)** _`:object`_

头结点没有 pre， 尾结点没有 next。

```javascript
interface NodeData {
    id: string;
    next?: string[];
    pre?: string[];
    
    [others: string]: any;
}

type data = Record<string, NodeData>;
```

**styleConfig** _`:object`_

```javascript
interface StyleConfig  {
    /** 流程图背景颜色，用于掩盖横向的连线。 */
    backgroundColor?: string;
    lineWidth?: number;
    lineColor?: string;
    distance?: { horizontal: number, vertical: number };
}
```

**RenderNode (required)** _`:ReactNode`_
节点的渲染函数。可以接收到 节点的属性 以及 onDeleteNode回调。

**onAdd (required)** _`(nodeId: string): void`_
点击 Add按钮 的回调

**onExpandBranch (required)** _`(nodeId: string): void`_
点击 Branch按钮 的回调

**onCombineNodes (required)** _`(nodesId: Array<string>): void`_
点击 Combine按钮 的回调

**onDeleteNode (required)** _`(nodeId: string): void`_
透传给RenderNode的，用于自定义删除按钮的 删除操作回调。

**RenderAddButton** _`:ReactNode`_
Add按钮 的自定义渲染函数。

**RenderBranchButton** _`:ReactNode`_
Branch按钮 的自定义渲染函数。

**RenderCombineButton** _`:ReactNode`_
Combine按钮 的自定义渲染函数。

**showAddButton** _`:boolean`_ = true
是否显示 Add按钮。

**showBranchButton** _`:boolean`_ = true
是否显示 Branch按钮。

**showCombineButton** _`:boolean`_ = true
是否显示 Combine按钮。

## 运行示例

Run the demos:

```bash
npm install
npm run start
```

## 打包

```bash
npm install
npm run build:lib
```

## License

MIT

## custom-lib相关QQ群

![image](https://github.com/custom-lib/custom-react-flowchart/blob/main/website/assets/qrCode.jpg)
