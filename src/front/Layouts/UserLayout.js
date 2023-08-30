import React from 'react';
import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../index.css';
import '../../step1.css';
import '../../step2.css';
import '../../step4.css';
import '../frontend.css';
import {registerLocale} from 'react-datepicker';
import {enUS,he} from 'date-fns/locale'
import "react-datepicker/dist/react-datepicker.css";
import Header from 'front/components/Header';
import { Helmet } from 'react-helmet';
import {IntlProvider} from 'react-intl';
import useApp from '../hooks/useApp';

import {LOCALES} from '../../translations/locales';

registerLocale('en-US',enUS);
registerLocale('he-IL',he);

function UserLayout() {
  const {language,translations} = useApp();
  return (
    <>
      <IntlProvider messages={translations[language.locale]} locale={language.locale} defaultLocale={language.defaultLocale}>
        <Helmet>
          <title>Snow Fun</title>
        </Helmet>
        <Header/>
        <Outlet/>
      </IntlProvider>
    </>
  )
}

export default UserLayout