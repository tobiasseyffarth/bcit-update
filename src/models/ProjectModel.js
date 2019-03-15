class Project {
  constructor(){
    this.name = 'Test';
  }

  setName = (name) => { this.name = name; };
  getName = () => this.name;
}

const ProjectModel = new Project();
module.exports = ProjectModel;
