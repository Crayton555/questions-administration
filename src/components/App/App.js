import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import React, {Component} from "react";
import {BrowserRouter as Router, Redirect, Route} from 'react-router-dom'
import QuestionsAdministrationService from "../../repository/questionsAdministrationRepository";
import Header from '../Header/header';
import Categories from "../Categories/categories"
import CategoryAdd from '../Categories/categoryAdd';
import CategoryEdit from "../Categories/categoryEdit";
import Labels from "../Labels/labels"
import LabelAdd from "../Labels/labelAdd";
import LabelEdit from "../Labels/labelEdit";
import Questions from "../Questions/questions"
import QuestionAdd from "../Questions/questionAdd";
import QuestionEdit from "../Questions/questionEdit";
import CategoryQuestionDragDrop from '../CategoryQuestions/CategoryQuestionDragDrop';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [], selectedCategory: {},
            labels: [], selectedLabel: {},
            questions: [], selectedQuestion: {},
            selectedFile: null
        }
    }
    render() {
        return (<Router>
            <Header/>
            <main>
                <div className="container">
                    <Route path={"/categories/add"} exact
                           render={() => <CategoryAdd categories={this.state.categories}
                                                      onAddCategory={this.addCategory}/>}/>
                    <Route path={"/categories/edit/:id"} exact render={() => <CategoryEdit
                        categories={this.state.categories}
                        onEditCategory={this.editCategory}
                        category={this.state.selectedCategory}/>}/>
                    <Route path={"/categories"} exact render={() => <Categories categories={this.state.categories}
                                                                                onDelete={this.deleteCategory}
                                                                                onEdit={this.getCategory}/>}/>

                    <Route path={"/labels/add"} exact
                           render={() => <LabelAdd onAddLabel={this.addLabel}/>}/>
                    <Route path={"/labels/edit/:id"} exact render={() => <LabelEdit
                        onEditLabel={this.editLabel}
                        label={this.state.selectedLabel}/>}/>
                    <Route path={"/labels"} exact render={() => <Labels labels={this.state.labels}
                                                                        onDelete={this.deleteLabel}
                                                                        onEdit={this.getLabel}/>}/>

                    <Route path={"/questions/add"} exact
                           render={() => <QuestionAdd categories={this.state.categories}
                                                      labels={this.state.labels}
                                                      onAddQuestion={this.addQuestion}/>}/>
                    <Route path={"/questions/edit/:id"} exact render={() => <QuestionEdit
                        categories={this.state.categories}
                        labels={this.state.labels}
                        question={this.state.selectedQuestion}
                        onEditQuestion={this.editQuestion}/>}/>
                    <Route path={"/questions"} exact render={() =>
                        <Questions questions={this.state.questions}
                                   onDelete={this.deleteQuestion}
                                   onEdit={this.getQuestion}
                                   onFileSelect={this.handleFileSelect}
                                   onFileUpload={this.handleFileUpload}
                                   selectedFile={this.state.selectedFile}
                                   onAddNewLabelToQuestion={this.addNewLabelToQuestion}
                                   onEditLabel={this.editLabelQuestion}
                        />}/>
                    <Route path={"/categories-drag-drop"} exact component={CategoryQuestionDragDrop}/>
                </div>
            </main>
        </Router>);
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = () => {
        this.loadCategories();
        this.loadLabels();
        this.loadQuestions();
    }

    loadQuestions = () => {
        QuestionsAdministrationService.fetchQuestions()
            .then((data) => {
                this.setState({
                    questions: data.data
                })
            });
    }
    deleteQuestion = (id) => {
        QuestionsAdministrationService.deleteQuestion(id)
            .then(() => {
                this.loadQuestions();
            });
    }
    addQuestion = (questionWrapper) => {
        QuestionsAdministrationService.addQuestion(questionWrapper)
            .then(() => {
                this.loadQuestions();
            })
            .catch(error => {
                console.error("Error adding question:", error);
            });
    }

    getQuestion = (id) => {
        QuestionsAdministrationService.getQuestion(id)
            .then((data) => {
                this.setState({
                    selectedQuestion: data.data
                })
            })
    }
    editQuestion = (id, questionWrapper) => {
        QuestionsAdministrationService.editQuestion(id, questionWrapper)
            .then(() => {
                this.loadQuestions();
            });
    }

    loadCategories = () => {
        QuestionsAdministrationService.fetchCategories()
            .then((data) => {
                this.setState({
                    categories: data.data
                })
            });
    }
    deleteCategory = (id) => {
        QuestionsAdministrationService.deleteCategory(id)
            .then(() => {
                this.loadCategories();
            });
    }
    getCategory = (id) => {
        QuestionsAdministrationService.getCategory(id)
            .then((data) => {
                this.setState({
                    selectedCategory: data.data
                })
            })
    }
    addCategory = (category) => {
        QuestionsAdministrationService.addCategory(category)
            .then(() => {
                this.loadCategories();
            })
            .catch(error => {
                console.error("Error adding category:", error);
            });
    }
    editCategory = (id, category) => {
        QuestionsAdministrationService.editCategory(id, category)
            .then(() => {
                this.loadCategories();
                this.loadQuestions();
            })
            .catch(error => {
                console.error("Error updating category:", error);
            });
    }
    loadLabels = () => {
        QuestionsAdministrationService.fetchLabels()
            .then((data) => {
                this.setState({
                    labels: data.data
                })
            });
    }
    deleteLabel = (id) => {
        QuestionsAdministrationService.deleteLabel(id)
            .then(() => {
                this.loadLabels();
            });
    }
    addLabel = (name, questionIds) => {
        QuestionsAdministrationService.addLabel(name, questionIds)
            .then(() => {
                this.loadLabels();
            });
    }
    getLabel = (id) => {
        QuestionsAdministrationService.getLabel(id)
            .then((data) => {
                this.setState({
                    selectedLabel: data.data
                })
            })
    }
    editLabel = (id, name, questionIds) => {
        QuestionsAdministrationService.editLabel(id, name, questionIds)
            .then(() => {
                this.loadLabels();
                this.loadQuestions();
            });
    }
    handleFileSelect = (event) => {
        this.setState({ selectedFile: event.target.files[0] });
    };
    handleFileUpload = () => {
        const { selectedFile } = this.state;
        if (!selectedFile) {
            alert("Please select a file first!");
            return;
        }
        QuestionsAdministrationService.uploadQuestionFile(selectedFile)
            .then((response) => {
                console.log("File uploaded successfully:", response.data);
                this.loadQuestions();
                this.loadCategories();
                this.loadLabels();
            })
            .catch((error) => {
                console.error("Error uploading file:", error);
            });
    };
    addNewLabelToQuestion = (questionId, labelName) => {
        QuestionsAdministrationService.addNewLabelToQuestion(questionId, {name: labelName})
            .then(() => {
                console.log("New label added to question successfully");
                this.loadLabels();
                this.loadQuestions();
            })
            .catch(error => {
                console.error("Error adding new label to question:", error);
            });
    };
    editLabelQuestion = (id, name, questionIds) => {
        QuestionsAdministrationService.editLabel(id, name, questionIds)
            .then(() => {
                this.loadLabels();
                this.loadQuestions();
            });
    }
}

export default App;