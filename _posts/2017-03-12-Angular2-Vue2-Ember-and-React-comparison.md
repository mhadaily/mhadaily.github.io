---
layout: post
title:  "Which one should I choose? Angular 2, Vue.js, React.js and Ember.js?"
date:   2017-03-12
excerpt: "In the battle of front-end frameworks there are many words around, however, which is the best at the end and you should choose? stick with me to find out more..."
tag:
- Angular 
- React
- Vue.js
- Ember.js
---

It is a very good sunday and exciting to me. The reason is that yesterday I spent couple of hours and I built my first Vue.js simple app using 
Vux and uiElement in order to compare Vue with React, Angular2 and Ember.js. It's live here:  [Live Demo - Vue.js Shop](https://www.majidhajian.com/vue2-shop/)

In the battle of front-end frameworks, these days, I feel I am confused that how to answer my question about "which frameworks should I choose?". 
As a passionate Javascript developer, it is super tough to choose between the following frameworks or library to start a new project. All of them come with pros and cons as well as perfect features that makes you impressed and confused that which one you should use. 

I tried to wrap up my research and experiences as a single table which can be reviewed below:

|                               | Ember.js                                                                               | Angular 2                                                                                                                                                 | Vue.js 2                                                                                           | React.js                                           |
|-------------------------------|----------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|----------------------------------------------------|
| Github Start                  | 17,620                                                                                 | 55,021 + 21,572                                                                                                                                           | 46,272                                                                                             | 61,653                                             |
| Contributors                  | 651                                                                                    | 1571 + 408                                                                                                                                                | 84                                                                                                 | 954                                                |
| Stackoverflow                 | 20,822                                                                                 | 40,374                                                                                                                                                    | 4,789                                                                                              | 35,846                                             |
| Reactive Programming          | Not in the core - Addon : RxEmber - not up to date                                     | RxJs 5, In the core                                                                                                                                       | Partially in the core, Fully with addon                                                            | Not in the core, very good plugin                  |
| State Management              | Ember Data - core  Ember-Redux addon                                                   | Observable Stream in core, Two perfect plugin for Redux One is a wrapper Redux =-angular and one is based on Redux but it has its own API, Ng-redux/store | Vuex which considers as Core addon                                                                 | React-Redux supports with community                |
| Functional Programing         | yes                                                                                    | yes                                                                                                                                                       | yes                                                                                                | yes                                                |
| Isomorphic                    | Fast-boot Still beta                                                                   | Universal, part of the core                                                                                                                               | dfferent plugin, Nuxt, vue-server-renderer                                                         | different approach, mostly good                    |
| Native App Or Hybrid App      | different addons such as ember-cli-cordova                                             | NativeScript port                                                                                                                                         | weex, still under development from Alibaba                                                         | React Native                                       |
| Browser Support               | IE9+                                                                                   | IE10+ , Polyfill for IE9                                                                                                                                  | IE9+                                                                                               | IE9+                                               |
| Animation Support             | with addon                                                                             | In core, @angular/animation                                                                                                                               | in core Transition                                                                                 | Addon                                              |
| Bundler                       | Broccoli, however can be port to webpack and rollupjs                                  | Webpack, completely ready to be use with System.js or Rollup.js                                                                                           | webpack, can be port to different bundler                                                          | webpack can be port to different bundler           |
| App Structure                 | Strictly Opinionated                                                                   | Partially Opinionated                                                                                                                                     | unopinionated                                                                                      | unopinionated                                      |
| Sponsor                       | Tilde INC                                                                              | Google                                                                                                                                                    | Evan You! but to be adapted by Alibaba                                                             | Facebook                                           |
| Typescript Support            | Through Addon with Pain, However, ES6 is more than enough for Ember                    | Core                                                                                                                                                      | can be port to typescript however can be painful while using addon due to lack of proper typing    | possible, however JSX is powerful enough           |
| Lazy Loading                  | with Addon, natively needs more develop, however, result is aswesome                   | in Core with ng router and webpack                                                                                                                        | in core with vue-router and webpack                                                                | addon with react-router and webpack                |
| Framework Architecture        | MVVM                                                                                   | MVVM + Modular system through Component Architecture                                                                                                      | VM and component architecture                                                                      | VM and component architecture                      |
| Tree Shaking                  | Addon for broccoli                                                                     | webpack2 supports                                                                                                                                         | webpack2 supports                                                                                  | webpack2 supports                                  |
| Deployment                    | wide range of platforms with Ember-cli-deploy as easy as one command !!                | through addons with great support and less configuration,However, good pipeline for deployment                                                            | Not really have  good pipeline and can be painful to design, however, many good examples are found | wide rang of possibilites with Zero configuration  |
| Unit Test                     | Qunit but not limited to                                                               | Jasmine but not limited to                                                                                                                                | Mocha but not limited to                                                                           | Jest but not limited to                            |
| Test Runner                   | Karma                                                                                  | Karma                                                                                                                                                     | Karma                                                                                              | Karma                                              |
| End-to-End (integration) Test | ember-testing,and can be integrated with different approach however, it may be painful | protractor and can be integrated with different approach however, it may be painful                                                                       | Nightwatch or testcafe                                                                             | Selenium WebDriver and many more                   |
| Learning Curve                | Advanced                                                                               | Advanced                                                                                                                                                  | Simple                                                                                             | Simple                                             |
| Enterprise Adaptability       | YES, specially with Ember Engine                                                       | Recommend for this section                                                                                                                                | apparently it is however, not much real example                                                    | Yes                                                |
| Code Complexity               | Mature SDK like Rails                                                                  | Well-riched framework like Java based frameworks                                                                                                          | Library                                                                                            | Library                                            |
| Chrome Debugger               | YES                                                                                    | YES                                                                                                                                                       | YES                                                                                                | YES                                                |
| Progressive web app           | Addon                                                                                  | Addon and webpack plugin                                                                                                                                  | Addon,and webpack plugin                                                                           | Addon,and webpack plugin                           |
| Job Oppurtunity               | not that much                                                                          | A lot                                                                                                                                                     | rarely                                                                                             | A lot                                              |
| Directive                     | yes but different approach                                                             | yes                                                                                                                                                       | yes                                                                                                | yes                                                |
| Data binding                  | Two way, very efficient                                                                | Two way, super efficient                                                                                                                                  | Two way, super efficient                                                                           | Two way, super efficient                           |
| Filter, Pipe, mixin, helper   | All supported                                                                          | All supported                                                                                                                                             | All supported                                                                                      | All supported                                      |
| Event Binding                 | yes such as on-submit, also using actions                                              | yes such as ng-click and also using Emitter                                                                                                               | Yes such as v-on and also using Methods                                                            | yes such as onclick and also suing methods         |

## Performance
 
 All have been developed with performance in mind,however, they are fairly similar with a minor differences which in my 
 opinion, it ready does not matter in the end. The chart below shows that the final results is pretty much similar with little milliseconds discrepancies.
 
![QUick Performance comparison](/images/march2017/performance.jpg "quick performance comparison")

Benchmarked by: [js-framework-benchmark](https://github.com/krausest/js-framework-benchmark)
Credited to: [stefan krause](http://www.stefankrause.net/wp/?p=392) 
 
 
## Which one to choose?

As you see, There are many similarities between them, although they tend to follow their mindset. All of them are awesome 
and all of their works is highly appreciated. However, at the end of the day, we need to choose one in our team, therefore, 
here is my opinion. 

### Ember.js

An awesome framework and as its builders say, it is going to be a SDK for web. Although learning ember doest not seem easy, it is
a fact that if you get used to it, you are not able to abandon it! I personally believe (as a one year Ember developer), it's by far
one of the best in Front-end technology and should be used for Semi-enterprise to enterprise application where all developers
are mostly senior. Moreover, finding senior and ember developer should not be that much difficult for the company in order to expand the team in the future. 

### Angular 2

Well, it has been designed to mitigate performance, productivity and unique codebase between different platforms. Hence, indeed, they did a great job can could achieve their goals. 
Angular's roadmap is very distinctive. One of the main strengths of Angular team is to be backed by Google. However, it's should be considered only for enterprise application.
 
### Vue.js

Nothing can be easier than Vue.js. Super slim and easy to learn. Vue's goal tends to stick on pure javascript object and functionality rather than make that complex. 
Hence, Vue's performance has slightly better than other rivals and make that easy to learn and very handy to have a quick project. However, due to less community members and obscured
roadmap as well as lack of large well-tested application in production, I am still doubtful to say it can be use in enterprise while it is the best to start
for small and medium applications. 

### React.js

Well, nothing to say. It's perfect at every single aspect. Although I personally do not like to write JSX code, I would say it is the 
most powerful approach that I have seen so far. React is a tiny library to manipulate the DOM which fits small project need, whereas it can be powerful enough when it combines with other addons to build a enterprise app. In one word, 
 
 
## So what do I prefer finally?

In my perspective, choosing of the above frameworks is completely depends on your projects, the future of that and more importantly
the company and the team that you are working with. For some, it's is important to see huge backers and obvious roadmap then you should consider React and Angular2 while others think simplicity is the most important one then 
you definitely should consider Vue.js. 

Like I said, I am a passionate Javascript developer and I love all of them. However, last but not least, my personal choices would be: 1- Angular, 2- Ember, 3- React and 4- Vue. 

My advice is "do not spend to much time to choose between one of the frameworks named above, in fact, find the one that is the most desirable and adaptable among team's developers or you feel comfortable the most."
