import React from 'react';
import { useI18n } from '../App';
import styles from './Temp.module.scss';

const transitions = {
    en: {
        text: 'Select the action to be performed',
    },
    zh: {
        text: '选择要执行的操作',
    },
} as const;

const Temp: React.FC = () => {
    const i18n = useI18n(transitions);

    return (
        <div className={styles.wrapper}>
            {i18n.text}
        </div>
    );
}

export default Temp;