import React, { createContext, useCallback, useContext, useState } from 'react';
import { Button, Toast } from 'react-customize-ui';
import FlowChartDemo from './FlowChartDemo';
const LocaleContext = createContext<{ locale: 'en' | 'zh'; setLocal: React.Dispatch<React.SetStateAction<"en" | "zh">> }>(null!);

function App() {
    const [locale, setLocal] = useState<'zh' | 'en'>(() => navigator.language.includes('zh') ? 'zh' : 'en');
    const handleChangeLanguage = useCallback(() => setLocal(preLocale => preLocale === 'zh' ? 'en' : 'zh'), []);

    return (
        <LocaleContext.Provider value={{ locale, setLocal }}>
            <Toast.Provider value={{ locale }}/>
            <FlowChartDemo />
            {/* <Button color="black" className="language_btn" onClick={handleChangeLanguage} tabIndex={-1}>{locale === 'en' ? '简体中文' : 'English'}</Button> */}
        </LocaleContext.Provider>
    );
}


export const useI18n = <T extends Record<'en' | 'zh', Record<string, string>>>(transitions: T) => {
    const { locale } = useContext(LocaleContext);
    return transitions[locale];
}

export default App;
