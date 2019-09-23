# BCIT2

BCIT2 is a tool for analyzing the interactions between business process compliance
and information technology. Furthermore BCIT2 is able to adapt the business process through alternative compliance processes.
BCIT2 demonstrates the feasibility of the methods proposed in [1, 2] and extends the previously introduced version [3].  

## Content
- [Features](#features)
- [Setup](#setup)
- [Tutorial Document](#Tutorial Document)
- [Example Models](#Example Models)
- [Video](#Video)
- [Credits](#credits)
- [License](#license)
- [References](#references)

## Features
- Import business process modelled as *.bpmn, import IT architecture modelled as TOGAF Open Exchange Format and import compliance requirement model 
- Connect the model elements together
- Analyze the interactions between business process compliance and business process change [1] 
- Define alternative compliance processes and their interrelation [2]
- Automatically put forward proposals for a business process adaptation in case of a business process compliance violation [2]
- Export adapted business processes as *.bpmn 

## Setup
You can use BCIT2 in two different ways:
- You can use it online on[https://anonymforreview.github.io/](https://anonymforreview.github.io/)
- Yu can run it locally: 
   1. Clone the repository `git clone https://github.com/anonymForReview/bcit2.git`
   2. Change directory `cd compliance-checker`
   3. Install dependencies `npm install`
   4. Start BCIT `npm run start`
   5. Open BCIT in your preferred browser

**Requirements**
- Node.JS >= 10.15 (only for local usage)
- Firefox version -1 or Chrome version -1 (in both cases a desktop version is required)

## Tutorial Document
- The tutorial document that shows one use case of the tool can be found in [/resources/tutorial/tutorial_BCIT2.pdf](/resources/tutorial/tutorial_BCIT2.pdf).

## Example Models
- The models used in the motivation scenario and can be found [here](https://cloud.uni-halle.de/s/eII8IIuKwPmRLR2). The zip file contains four files.
    - *BCIT project model.bcit*: contains the running scenario of the paper as one final project.
    - *process model.bpmn*: contains process model modelled as BPMN.
    - *architecture model.xml*: contains IT infrastructure modeled as TOGAF architecture model.
    - *compliance model.json*: contains compliance requirements.

## Video
- A quick introduction to BCIT2  that demonstrates its basic features is given in the following [screencast](https://cloud.uni-halle.de/s/q09oK57WnqgvZyr).

## Credits
- anonymForReview

## License
MIT

## References
* [1] Seyffarth, T., Kuehnel, S., Sackmann, S., Business Process Compliance and Business Process Change. An Approach to Analyze the Interactions, in: Business Information Systems. BIS 2018. Lecture Notes in Business Information Processing (2018), pp. 176–189.
* [2] Seyffarth, T., Kuehnel, S., Sackmann, S., Business Process Compliance despite Change. Towards Proposals for a Business Process Adaption, in: Information Systems Engineering in Responsible Information Systems. CAiSE 2019. Lecture Notes in Business Information Processing, vol 350. (2019), pp. 227–239.
* [3] Seyffarth, T., Raschke, K., BCIT. A Tool for Analyzing the Interactions between Business Process Compliance and Business Process Change, in: Proceedings of the Dissertation Award and Demonstration, Industrial Track at BPM 2018 (2018), pp. 81–85.

