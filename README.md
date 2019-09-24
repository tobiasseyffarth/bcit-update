# BCIT2

BCIT2 is a tool for analyzing the interactions between business process compliance
and information technology. Furthermore BCIT2 is able to adapt the business process through alternative compliance processes.
BCIT2 demonstrates the feasibility of the methods proposed in [1, 2] and extends the previously introduced version [3].  

## Content
- [Features](#features)
- [Run BCIT2](#Run BCIT2)
- [Video](#Video)
- [Tutorial](#Tutorial)
- [Models](#Models)
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

## Run BCIT2
You can run BCIT2 in two different ways:
- You can use it online on [https://anonymforreview.github.io/](https://anonymforreview.github.io/)
- You can run it locally:
   1. Open a terminal 
   2. Clone the repository `git clone https://github.com/anonymForReview/bcit2.git`
   3. Change directory `cd compliance-checker`
   4. Install dependencies `npm install`
   5. Start BCIT2 `npm run start`
   6. Open BCIT2 in your preferred browser

**Requirements**
- Firefox version -1 or Chrome version -1 (in both cases a desktop version is required)

**Further requirements for local usage**
- [Git](https://git-scm.com/downloads)
- [Node.JS](https://nodejs.org/en/download/) >= 10.15

## Video
- A demo video that introduces the basic features of BCIT2 is available [here](https://cloud.uni-halle.de/s/q09oK57WnqgvZyr).

## Tutorial
- The tutorial document that describes the basic features step-by-step can be found in [/resources/tutorial/tutorial_BCIT2.pdf](/resources/tutorial/tutorial_BCIT2.pdf).

## Models
- The **motivation scenario** in one single project file can be found [here.](https://cloud.uni-halle.de/s/eII8IIuKwPmRLR2) Unzip the file and open the project file in BCIT2 via File -> Open Project -> select the unzipped file *BCIT project.bcit*
- Alternatively, the scenario can also be reproduced with the **individual process, IT infrastructure and compliance models**. The individual models models can be found [here.](https://cloud.uni-halle.de/s/eII8IIuKwPmRLR2) The zip file contains three files:
    - *architecture model.xml*: contains IT infrastructure modeled as TOGAF architecture model.
    - *compliance model.json*: contains compliance requirements.
    - *process model.bpmn*: contains process model modelled as BPMN.

## Credits
- anonymForReview

## License
MIT

## References
* [1] Seyffarth, T., Kuehnel, S., Sackmann, S., Business Process Compliance and Business Process Change. An Approach to Analyze the Interactions, in: Business Information Systems. BIS 2018. Lecture Notes in Business Information Processing (2018), pp. 176–189.
* [2] Seyffarth, T., Kuehnel, S., Sackmann, S., Business Process Compliance despite Change. Towards Proposals for a Business Process Adaption, in: Information Systems Engineering in Responsible Information Systems. CAiSE 2019. Lecture Notes in Business Information Processing, vol 350. (2019), pp. 227–239.
* [3] Seyffarth, T., Raschke, K., BCIT. A Tool for Analyzing the Interactions between Business Process Compliance and Business Process Change, in: Proceedings of the Dissertation Award and Demonstration, Industrial Track at BPM 2018 (2018), pp. 81–85.