# BCIT 2.0

BCIT 2.0 is a tool for analyzing the interactions between business process compliance
and information technology. Furthermore BCIT is able to adapt the business process through alternative compliance processes.
BCIT 2.0 demonstrates the feasibility of the methods proposed in [1, 2] and extends the previously introduced version [3].  

## Content
- [Features](#features)
- [Setup](#setup)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)

## Features
- Import business process modelled as *.bpmn, import IT architecture modelled as TOGAF Open Exchange Format and import compliance requirement model 
- Link the model elements together
- Analyze the interactions between business process compliance and business process change [1] 
- Define alternative compliance processes and their interrelation [2]
- Automatically put forward proposals for a business process adaptation in case of a business process compliance violation 
- Export adapted business processes as *.bpmn 

## Setup
You can use BCIT 2.0 online on the following [GitHub Page](https://pages.github.com/) or you can run it locally: 
   1. Clone the repository `git clone`
   2. Install dependencies `npm install`
   3. Start BCIT `npm start`
   4. Open BCIT in your preferred browser

**Requirements**
- Node.JS >= 10.15 (only for local usage)
- Firefox version -1 or Chrome version -1

## Tutorial Document and Screencast
- The models used in the demo can be found in [/resources/models](/resources/models).  
- The tutorial document that shows one use case of the tool can be found [here](/resources/tutorial/tutorial_BCIT2.pdf).
- Furthermore, the usage of BCIT 2.0 is show in the following [screencast](/resources/screencast/bcit2.mp4).

## Credits
- Tobias Seyffarth
- Kai Raschke

## License
MIT

##References
* [1] Seyffarth, T., Kuehnel, S., Sackmann, S., Business Process Compliance and Business Process Change. An Approach to Analyze the Interactions, in: Business Information Systems. BIS 2018. Lecture Notes in Business Information Processing (2018), pp. 176–189.
* [2] Seyffarth, T., Kuehnel, S., Sackmann, S., Business Process Compliance despite Change. Towards Proposals for a Business Process Adaption, in: Information Systems Engineering in Responsible Information Systems. CAiSE 2019. Lecture Notes in Business Information Processing, vol 350. (2019), pp. 227–239.
* [3] Seyffarth, T., Raschke, K., BCIT. A Tool for Analyzing the Interactions between Business Process Compliance and Business Process Change, in: Proceedings of the Dissertation Award and Demonstration, Industrial Track at BPM 2018 (2018), pp. 81–85.

