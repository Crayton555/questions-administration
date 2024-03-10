import React from 'react';
import ReactPaginate from 'react-paginate'
import {Link} from 'react-router-dom';
import QuestionTerm from './questionTerm';
import QuestionsAdministrationService from '../../repository/questionsAdministrationRepository';

class Questions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0, size: 10, searchTerm: ""
        }
    }
    componentDidMount() {
        this.loadQuestions();
    }
    loadQuestions = () => {
        QuestionsAdministrationService.fetchQuestions()
            .then((data) => {
                this.setState({
                    questions: data.data
                });
            })
            .catch(error => {
                console.error("Error loading questions:", error);
            });
    }
    handlePageClick = (data) => {
        let selected = data.selected;
        this.setState({
            page: selected
        });
    }
    getQuestionsPage = (offset, nextPageOffset) => {
        const filteredQuestions = this.props.questions
            .filter(question => question.name.toLowerCase().includes(this.state.searchTerm.toLowerCase()))
            .filter((question, index) => index >= offset && index < nextPageOffset);

        return filteredQuestions.map((term) => (<QuestionTerm
            key={term.id}
            term={term}
            onDelete={this.props.onDelete}
            onEdit={this.props.onEdit}
            onAddNewLabelToQuestion={this.props.onAddNewLabelToQuestion}
            onEditLabel={this.props.onEditLabel}
        />));
    };
    render() {
        const offset = this.state.size * this.state.page;
        const nextPageOffset = offset + this.state.size;
        const pageCount = Math.ceil(this.props.questions.length / this.state.size);
        const questions = this.getQuestionsPage(offset, nextPageOffset);
        const {onFileSelect, onFileUpload} = this.props;

        return (<div className={"container mm-4 mt-5"}>
            <div className="row mb-4">
                <div className="col">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={this.state.searchTerm}
                        onChange={(e) => this.setState({searchTerm: e.target.value})}
                        className="form-control"
                    />
                </div>
            </div>
            <div className={"row"}>
                <div className={"table-responsive"}>
                    <table className={"table table-striped"}>
                        <thead>
                        <tr>
                            <th scope={"col"}>Name</th>
                            <th scope={"col"}>Question Text</th>
                            <th scope={"col"}>Category</th>
                            <th scope={"col"}>Labels</th>
                        </tr>
                        </thead>
                        <tbody>
                        {questions}
                        </tbody>
                    </table>
                </div>
                <div className="col mb-3">
                    <div className="row">
                        <div className="col-sm-12 col-md-12">
                            <Link className={"btn btn-block btn-dark"} to={"/questions/add"}>Add new
                                questions</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col">
                    <input
                        type="file"
                        accept=".xml"
                        onChange={onFileSelect}
                        className="form-control-file"
                    />
                    <button
                        onClick={onFileUpload}
                        className="btn btn-primary"
                    >
                        Upload XML File
                    </button>
                </div>
            </div>
            <ReactPaginate
                previousLabel={"back"}
                nextLabel={"next"}
                breakLabel={<a href="/#">...</a>}
                breakClassName={"break-me"}
                pageClassName={"ml-1"}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.handlePageClick}
                containerClassName={"pagination m-4 justify-content-center"}
                activeClassName={"active"}
            />
        </div>);
    }
}

export default Questions;