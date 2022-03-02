import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store/index';
import i18n from '@/plugins/i18n';
import '@/registerServiceWorker';
import { StylesManager } from 'survey-vue';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

StylesManager.applyTheme('bootstrapmaterial');

function getLanguage() {
  const language = document.getElementsByTagName('html')[0].getAttribute('lang');
  let switchLanguage = 'fr';
  if (language === 'fr' || language === 'fr-CA') {
    switchLanguage = 'en';
  } else {
    switchLanguage = 'fr';
  }
  return switchLanguage;
}

function reloadTemplate() {
  // babel will handle transpilation to ES5
  // const language = document
  //   .getElementsByTagName("html")[0]
  //   .getAttribute("lang");
  let switchLanguage = getLanguage();

  const defTop = document.getElementById('def-top');

  /* global wet */
  if (defTop) {
    // @ts-ignore
    defTop.innerHTML = wet.builder.appTop({
      appName: [
        {
          href: './',
          text:
            switchLanguage === 'en'
              ? 'Digital Standards Self-Assessment'
              : 'Évaluation des normes relatives au numérique',
        },
      ],
      search: false,
    });

    document.getElementsByClassName('app-name')[0]!.classList.add('wb-inv');
  }

  let defPreFooter = document.getElementById('def-preFooter');
  if (defPreFooter) {
    // @ts-ignore
    defPreFooter.innerHTML = wet.builder.preFooter({
      // see public index.html
      // get the build time which is injected into the root element at build time
      dateModified: '2022-01-07',
      versionIdentifier: '1.0.0',
      showPostContent: false,
      showFeedback: false,
      showShare: false,
    });
  }
  let defFooter = document.getElementById('def-footer');
  if (defFooter) {
    // @ts-ignore
    defFooter.innerHTML = wet.builder.appFooter({
      footerSections: [
        {
          href:
            switchLanguage === 'en'
              ? 'https://sara-sabr.github.io/ITStrategy/a-propos-de-nous.html'
              : 'https://sara-sabr.github.io/ITStrategy/about-us.html',
          newWindow: true,
          text: switchLanguage === 'en' ? 'À propos de nous' : 'About us',
        },
        {
          href:
            switchLanguage === 'en'
              ? 'https://sara-sabr.github.io/ITStrategy/auto-evaluation-devops.html'
              : 'https://sara-sabr.github.io/ITStrategy/devops-self-assessment.html',
          newWindow: true,
          text: switchLanguage === 'en' ? 'Fonctionnement' : 'How it works',
        },
        {
          href:
            switchLanguage === 'en'
              ? 'https://github.com/canada-ca/digital-standards-self-assessment'
              : 'https://github.com/canada-ca/digital-standards-self-assessment',
          newWindow: true,
          text: switchLanguage === 'en' ? 'Code source' : 'Source code',
        },
      ],
      contactLink: [
        {
          href:
            switchLanguage === 'en'
              ? 'https://sara-sabr.github.io/ITStrategy/contactez-nous.html'
              : 'https://sara-sabr.github.io/ITStrategy/contact-us.html',
          newWindow: true,
        },
      ],
      termsLink: [
        {
          newWindow: true,
        },
      ],
      privacyLink: [
        {
          newWindow: true,
        },
      ],
      showFeatures: false,
    });
  }
}

// cdts language switching is built for static applications
// create a language button which will toggle the i18n locale from english to french
// such as the page does not need to reload  if a user switches the language
function generateLanguageToggle() {
  const htmlElement = document.getElementsByTagName('html')[0];
  // const language = htmlElement.getAttribute("lang");
  let switchLanguage = getLanguage();

  let languageDiv = document.createElement('div');
  languageDiv.className = 'col-xs-7 col-md-8 text-right';

  // create language toggle
  let languageButton = document.createElement('button');
  languageButton.innerText = switchLanguage === 'en' ? 'English' : 'Francais';
  languageButton.className = 'btn btn-default fixed-top language-button position-absolute page-actions';
  languageButton.style['left'] = 'unset';
  languageButton.addEventListener('click', (e) => {
    let currentLanguage = i18n.locale;

    if (currentLanguage === 'fr') {
      i18n.locale = 'en';

      if (e.target instanceof HTMLElement) {
        e.target.innerText = 'Francais';
      }
      htmlElement.setAttribute('lang', 'en');
      reloadTemplate();

      // once the template reloads we will need to mount the button back into the banner
      let wbBanner = document.getElementById('wb-bnr') as HTMLElement;
      document
        .getElementById('wb-bnr')!
        .firstChild!.appendChild((e.currentTarget as HTMLElement).parentElement as HTMLElement);
    } else {
      i18n.locale = 'fr';
      if (e.target instanceof HTMLElement) {
        e.target.innerText = 'English';
      }
      htmlElement.setAttribute('lang', 'fr');
      reloadTemplate();

      let wbBanner = document.getElementById('wb-bnr') as HTMLElement;
      document
        .getElementById('wb-bnr')!
        .firstChild!.appendChild((e.currentTarget as HTMLElement).parentElement as HTMLElement);
    }

    // reload the cdts template
  });
  languageDiv.appendChild(languageButton);
  document.getElementById('wb-bnr')!.firstChild!.appendChild(languageDiv);
}

window.onload = () => {
  reloadTemplate();
  generateLanguageToggle();
  // window.history.replaceState(
  //   {},
  //   document.title,
  //   "/digital-standards-self-assessment/#/"
  // );
};

new Vue({
  created() {
    const html = document.documentElement;
    var lang = <string>this.$route.query['lang'];
    if (!lang) {
      lang = i18n.availableLocales[0];
    }
    i18n.locale = lang;
    html.setAttribute('lang', this.$i18n.t('htmlCode').toString());
  },
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
