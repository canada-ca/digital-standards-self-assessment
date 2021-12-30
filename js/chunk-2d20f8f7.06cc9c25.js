(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d20f8f7"],{b3c3:function(e,t,n){"use strict";n.r(t);var o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"results"},[n("h1",[e._v(" "+e._s(e.$t("sectionResultsTitle"))+" ")]),n("div",[void 0!==e.currentSection?n("ResultsCard",{attrs:{section:e.currentSection,"section-name":e.currentSection.sectionName,"user-score":e.currentSection.userScore,"max-score":e.getMaxScore(e.currentSection),"my-recommendations":e.myRecommendations,locale:e.locale}}):n("div",[n("p",[e._v(" "+e._s(e.$t("notice.noProgress"))+" ")])])],1),n("div",{staticClass:"page-actions"},[n("div",{staticClass:"row",staticStyle:{padding:"0 15px"}},[n("div",{staticClass:"col-3 col-sm-2 col-md-3"},[n("button",{staticClass:"btn btn-primary",staticStyle:{width:"inherit"},attrs:{type:"button"},on:{click:function(t){return e.goToQuestions()}}},[e._v(" ⇠ "+e._s(e.$t("navigation.goBack"))+" ")])]),n("div",{staticClass:"col-3 col-sm-2 col-md-3"},[n("button",{key:e.$route.path,staticClass:"btn btn-default",staticStyle:{width:"inherit"},attrs:{type:"button"},on:{click:function(t){return e.goToHomePage()}}},[e._v(" "+e._s(e.$t("navigation.chooseAnotherSection"))+" ")])])])])])},r=[],s=n("d4ec"),a=n("bee2"),i=n("262e"),c=n("2caf"),u=(n("e9c4"),n("9ab4")),l=n("60a3"),d=n("1b6e"),m=n("339e"),v=n.n(m),b=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("b-card",{staticClass:"mt-2"},[n("b-card-header",{staticClass:"h3"},[e._v(" "+e._s(e.getSectionName(e.thisSurveyData,e.sectionName))+" ")]),n("b-card-body",[n("p",{staticClass:"h5"},[e._v(" "+e._s(e.$t("currentScore"))+": "+e._s(e.sectionScoreLevel(e.userScore,e.maxScore))+"% ")]),n("p"),e.showRecommendation?e._e():n("ResultRecommendations",{attrs:{"section-name":e.sectionName,"section-score-level":e.sectionScoreLevel,"section-recommendations":e.myRecommendations.sectionRecommendations,locale:e.locale}})],1)],1)},h=[],p=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("b-card-body",e._l(e.getRecommendation(e.sectionRecommendations,e.sectionName,"0").title[e.locale],(function(t){return n("div",{key:t.id,domProps:{innerHTML:e._s(e.markdownToHtml(t))}})})),0)],1)},y=[],f=(n("7db0"),n("d3b7"),n("b0c0"),function(e){Object(i["a"])(n,e);var t=Object(c["a"])(n);function n(){return Object(s["a"])(this,n),t.apply(this,arguments)}return n}(l["c"]));Object(u["a"])([Object(l["b"])()],f.prototype,"sectionRecommendations",void 0),Object(u["a"])([Object(l["b"])()],f.prototype,"sectionName",void 0),Object(u["a"])([Object(l["b"])()],f.prototype,"sectionScoreLevel",void 0),Object(u["a"])([Object(l["b"])()],f.prototype,"locale",void 0),f=Object(u["a"])([Object(l["a"])({components:{ResultRecommendations:f},methods:{getRecommendation:function(e,t,n){var o=e.find((function(e){return e.name==t}));return null===o||void 0===o?void 0:o.recommendations[parseInt(n)]},markdownToHtml:function(e){var t=n("0e54");return t(e)}}})],f);var g=f,S=g,j=n("2877"),O=Object(j["a"])(S,p,y,!1,null,null,null),w=O.exports,$=function(e){Object(i["a"])(n,e);var t=Object(c["a"])(n);function n(){var e;return Object(s["a"])(this,n),e=t.apply(this,arguments),e.thisSurveyData=e.$store.getters.returnSurveyModel,e}return n}(l["c"]);Object(u["a"])([Object(l["b"])()],$.prototype,"sectionName",void 0),Object(u["a"])([Object(l["b"])()],$.prototype,"userScore",void 0),Object(u["a"])([Object(l["b"])()],$.prototype,"maxScore",void 0),Object(u["a"])([Object(l["b"])()],$.prototype,"myRecommendations",void 0),Object(u["a"])([Object(l["b"])()],$.prototype,"locale",void 0),$=Object(u["a"])([Object(l["a"])({components:{ResultsCard:$,ResultRecommendations:w},computed:{showRecommendation:function(){return"false"}},methods:{getSectionName:function(e,t){var n=e.getPageByName(t);return n.title},sectionScoreLevel:function(e,t){return new Intl.NumberFormat("en-CA",{style:"decimal",maximumFractionDigits:0}).format(e/t*100)}}})],$);var R=$,k=R,_=Object(j["a"])(k,b,h,!1,null,null,null),C=_.exports,N=n("fe0b"),L=n("6737"),x=n("fc60"),P=function(e){Object(i["a"])(n,e);var t=Object(c["a"])(n);function n(){var e;return Object(s["a"])(this,n),e=t.apply(this,arguments),e.myResults=e.$store.getters.resultsDataSections,e.Survey=new d["Model"](L),e}return Object(a["a"])(n,[{key:"goToHomePage",value:function(){this.$router.push("/")}},{key:"goToAllResults",value:function(){this.$router.push("/Results")}},{key:"goToQuestions",value:function(){this.$router.push("/Questions")}},{key:"buildSurveyFile",value:function(){return JSON.stringify({name:"surveyResults",version:this.$store.state.toolVersion,currentPage:this.$store.state.currentPageNo,data:this.$store.state.toolData})}},{key:"downloadSurveyAnswer",value:function(){var e="data:text/json;charset=utf-8,"+this.buildSurveyFile(),t=document.createElement("a");t.setAttribute("href",e),t.setAttribute("download","result.json"),document.body.appendChild(t),t.click(),t.remove()}},{key:"exportResults",value:function(){window.document.getElementById(this.$i18n.locale+"-content");var e=window.document.getElementsByClassName("page-actions");function t(){for(var t in e)e[parseInt(t)].classList&&e[parseInt(t)].classList.add("hidden")}function n(){for(var t in e)e[parseInt(t)].classList&&e[parseInt(t)].classList.remove("hidden")}window.addEventListener("beforeprint",t,!1),window.addEventListener("afterprint",n,!1),window.print(),window.removeEventListener("beforeprint",t),window.removeEventListener("afterprint",n)}},{key:"fileLoaded",value:function(e){this.Survey.data=e.data,this.Survey.currentPageNo=e.currentPage,this.Survey.start(),this.$store.dispatch(x["a"].UpdateSurveyData,this.Survey),this.myResults=this.$store.getters.resultDataSections}},{key:"changeLanguage",value:function(e,t){this.Survey.locale=e,this.Survey.render()}},{key:"created",value:function(){var e=this;this.Survey.onComplete.add((function(t){e.$store.dispatch(x["a"].UpdateSurveyData,t)})),this.Survey.onValueChanged.add((function(t){e.$store.dispatch(x["a"].UpdateSurveyData,t)}));var t=new v.a.Converter;this.Survey.onTextMarkdown.add((function(e,n){var o=t.makeHtml(n.text);o=o.substring(3),o=o.substring(0,o.length-4),n.html=o})),this.Survey.locale=N["a"].locale,this.Survey.onAfterRenderQuestion.add((function(e,t){var n=document.getElementsByName("welcome1");if(n&&n.length>0){var o=n[0];o.removeAttribute("aria-labelledby")}})),this.$store.getters.inProgress&&this.fileLoaded({currentPage:this.$store.state.currentPageNo,data:this.$store.state.toolData})}}]),n}(l["c"]);Object(u["a"])([Object(l["b"])()],P.prototype,"data",void 0),Object(u["a"])([Object(l["b"])()],P.prototype,"section",void 0),Object(u["a"])([Object(l["d"])("$i18n.locale")],P.prototype,"changeLanguage",null),P=Object(u["a"])([Object(l["a"])({components:{ResultsCard:C},computed:{sectionNames:function(){return this.$store.getters.returnSectionsNamesGenerated},results:function(){return this.$store.getters.resultsDataSections},sections:function(){return this.$store.getters.returnAllSections},currentSection:function(){return this.$store.getters.returnCurrentSection},myRecommendations:function(){return this.$store.state.recommendations},locale:function(){return this.$i18n.locale}},methods:{getMaxScore:function(e){return 5*e.questions.length}}})],P);var D=P,E=D,T=Object(j["a"])(E,o,r,!1,null,null,null);t["default"]=T.exports}}]);
//# sourceMappingURL=chunk-2d20f8f7.06cc9c25.js.map