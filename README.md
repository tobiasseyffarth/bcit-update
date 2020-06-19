# BCIT (Business Process Compliance and IT)

BCIT is a tool for analyzing the interactions between compliance, business process 
and information technology. Furthermore BCIT is able to propose compliant business process models through the integration of alternative compliance processes.
This version builds on its predecessor [1] and extends it by the feature to recommend compliant business processes based on process adaption. 

## Content
- [Features](#features)
- [Run](#Run)
- [Video](#Video)
- [Tutorial](#Tutorial)
- [Resources](#Resources)

## Features
- Import business process modelled as *.bpmn, import IT architecture modelled as TOGAF Open Exchange Format and import compliance requirement model 
- Connect the model elements together
- Analyze the interactions between compliance and business process change [2] 
- Define alternative compliance processes to compliance requirements [3]
- Automatically recommend compliant business process in case of a compliance violation [3]
- Export compliant business processes as *.bpmn 

## Run
You can run BCIT in two different ways:
- You can use it online on https://seyffarth.me/apps/bcit/ 
- You can run it locally:
   1. Open a terminal 
   2. Clone the repository `git clone https://github.com/tobiasseyffarth/bcit-update.git`
   3. Change directory `cd compliance-checker-master`
   4. Install dependencies `npm install` 
   5. Start BCIT `npm run start`
   6. Open BCIT in your preferred browser

**Requirements**
- Firefox version -1 or Chrome version -1 (in both cases a desktop version is required)

**Further requirements for local usage**
- [Git](https://git-scm.com/downloads)
- [Node.JS](https://nodejs.org/en/download/) >= 10.15

## Video
- A demo video that introduces the basic features of BCIT is available at https://cloud.uni-halle.de/s/hok34Awrt9BX9go.

## Tutorial
- A tutorial document is available at [/resources/](/resources/1-tutorial)

## Resources
- In [/resources/](/resources/) we provide additional information and documents.
Especially for working with the files in the project folder, we recommend cloning the entire repository via `git clone https://github.com/tobiasseyffarth/bcit-update.git`.

```
.
├── ...
├── resources                       # additional resources
│   ├── 1-tutorial                  # tutorial document that describes the basic features step-by-step   
│   ├── 2-project data              # two sample projects including the individual compliance model, process model and IT infrastructure model
│   │   ├── demo project            # demonstrates the motivation scenario in the paper
│   │   └── extended demo project   # second demo used in the evaluation
│   ├── 3-evaluation                # questionnaire, evaluation results and histogram of the evaluation results
│   └── 4-pseudocoode               # pseudocode of algorithm
└── ...
```

### Project Data
- Each project data folder contains the same file types.
```
.   
└──resources
    └── 2-project data              
        ├── demo project            
        │    ├── BCIT project.bcit              # includes the complete demo project 
        │    ├── compliance model.json          # compliance model used in the demo project
        │    ├── it architecture model.xml      # it architecture used in the demo project
        │    └── process model.bpmn             # business process used in the demo project
        └── extended demo project   
             └── ...

```

## References
[1] Seyffarth, Tobias; Raschke, Kai (2018): BCIT. A Tool for Analyzing the Interactions between Business Process Compliance and Business Process Change. In: Proceedings of the Dissertation Award and Demonstration, Industrial Track at BPM 2018, S. 81–85.

[2] Seyffarth, Tobias; Kühnel, Stephan; Sackmann, Stefan (2018): Business Process Compliance and Business Process Change. An Approach to Analyze the Interactions. In: Business Information Systems. BIS 2018. Lecture Notes in Business Information Processing (320), S. 176–189.

[3] Seyffarth, Tobias; Kühnel, Stephan; Sackmann, Stefan (2019): Business Process Compliance despite Change. Towards Proposals for a Business Process Adaption. In: Information Systems Engineering in Responsible Information Systems. CAiSE 2019. Lecture Notes in Business Information Processing, vol 350., S. 227–239. 