import React from 'react';
import clsx from 'clsx';
import { useI18n } from '../App';
import styles from './Condition.module.scss';

const transitions = {
    en: {
        title: 'Branch Node',
        content: 'For flowchart components, branch nodes are no different from normal nodes. For the scenario assumed in this demo, branch nodes are distinguished from normal nodes in that their number must be ≥ 2 (deleted together when the number is equal to 2, and added together when both are added).',
    },
    zh: {
        title: '分支节点',
        content: '对于流程图组件而言，分支节点与正常节点没有什么不同。以此demo假设的场景而言，分支节点区别于普通节点，它的数量必须≥2(数量等于2时一起删，添加时两个一起加）。',
    },
} as const;


interface Props {
    canDelete?: boolean;
    selected?: boolean;
    onClickDeleteNode?: () => void;
}

const Condition: React.FC<Props> = ({ selected, onClickDeleteNode }) => {
    const i18n = useI18n(transitions);

    return (
        <div className={clsx(styles.wrapper, { [styles.selected]: selected })}>
            <svg className={styles.deleteIcon} onClick={onClickDeleteNode} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path className={styles.deleteFill} d="M925.32 339.09a448.88 448.88 0 1 0 35.18 174.2 446 446 0 0 0-35.18-174.2z" fill="#cccccc" p-id="26148" data-spm-anchor-id="a313x.7781069.0.i100"></path><path d="M552.6 514.24l140-140a28 28 0 0 0 0-39.6 28 28 0 0 0-39.6 0l-140 140-140-140a28 28 0 0 0-39.6 0 28 28 0 0 0 0 39.6l140 140-140 140a28 28 0 0 0 0 39.6 28 28 0 0 0 39.6 0l140-140 140 140a28 28 0 1 0 39.6-39.6z" fill="#ffffff"></path></svg>
            <div className={styles.title}>{i18n.title}</div>
            <div className={styles.content}>{i18n.content}</div>
        </div>
    );
};

export default Condition;
