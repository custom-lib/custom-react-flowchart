import React from 'react';
import { useI18n } from '../App';
import styles from './StartEnd.module.scss';

const transitions = {
    en: {
        start: 'Start',
        end: 'End',
    },
    zh: {
        start: '流程开始',
        end: '流程结束',
    },
} as const;

export const Start: React.FC = () => {
    const i18n = useI18n(transitions);

    return (
        <div className={styles.wrapper}>
            <div className={styles.text}>{i18n.start}</div>
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path fill="#40a9ff" d="M149.989688 874.093352a509.948138 509.948138 0 1 0-109.714286-162.700613 513.206978 513.206978 0 0 0 109.714286 162.700613z"></path><path d="M429.646454 687.977369a57.331447 57.331447 0 0 0 27.277699 7.000472 60.348892 60.348892 0 0 0 32.829797-10.017916l175.977369-115.990571a68.677039 68.677039 0 0 0 30.777935-58.055634 66.504479 66.504479 0 0 0-29.812353-56.486563l-177.54644-115.749175a57.934936 57.934936 0 0 0-60.348892-3.017445 67.832155 67.832155 0 0 0-33.312588 60.348893V627.628477a67.470061 67.470061 0 0 0 34.157473 60.348892z" fill="#ffffff"></path></svg>
        </div>
    );
}

export const End: React.FC = () => {
    const i18n = useI18n(transitions);

    return (
        <div className={styles.wrapper}>
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path fill="#ff4d4f" d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024zM256 426.688a85.312 85.312 0 1 0 0 170.624h512a85.312 85.312 0 1 0 0-170.624H256z"></path></svg>
            <div className={styles.text}>{i18n.end}</div>
        </div>
    );
}