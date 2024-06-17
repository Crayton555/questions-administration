import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import QuestionsAdministrationService from '../../repository/questionsAdministrationRepository';
import {EditorContent, useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import {Button, Col, Form, Modal, Row} from "react-bootstrap";

const QuestionEdit = (props) => {
    const history = useHistory();
    const {id} = useParams();
    const [questionType, setQuestionType] = useState('ClozeQuestion');
    const [fileTypes, setFileTypes] = useState([{type: ""}]);
    const [subQuestions, setSubQuestions] = useState([{text: "", answer: "", subQuestionFormat: "HTML"}]);
    const [questionPoints, setQuestionPoints] = useState(1);
    const [showDetails, setShowDetails] = useState(false);
    const [formData, updateFormData] = useState({
        questionType: 'ClozeQuestion',
        name: "",
        questionText: "",
        questionTextFormat: 'HTML',
        generalFeedback: "",
        generalFeedbackFormat: 'HTML',
        penalty: 0.0,
        hidden: false,
        idNumber: "",
        categoryId: 1,
        labelIds: [],
        defaultGrade: 0.0,
        responseFormat: "",
        responseRequired: false,
        responseFieldLines: 0,
        minWordLimit: 0,
        maxWordLimit: 0,
        attachments: 0,
        attachmentsRequired: 0,
        maxBytes: 0,
        fileTypesList: [],
        graderInfo: "",
        graderInfoFormat: 'HTML',
        responseTemplate: "",
        responseTemplateFormat: 'HTML',
        shuffleAnswers: false,
        correctFeedback: "",
        partiallyCorrectFeedback: "",
        incorrectFeedback: "",
        correctFeedbackFormat: 'HTML',
        partiallyCorrectFeedbackFormat: 'HTML',
        incorrectFeedbackFormat: 'HTML',
        showNumCorrect: false,
        subQuestions: [{text: "", answer: "", subQuestionFormat: "HTML"}],
        single: false,
        answerNumbering: "",
        showStandardInstruction: false,
        answerOptions: [{fraction: 0.0, answerFormat: 'HTML', text: "", feedback: "", feedbackFormat: 'HTML'}],
        useCase: false,
        answerText: "",
        answerFraction: 0.0,
        answerFeedback: "",
        answerFormat: 'HTML',
        feedbackFormat: 'HTML'
    });
    const editor = useEditor({
        extensions: [StarterKit, Bold, Italic, Underline, TextAlign.configure({
            types: ['heading', 'paragraph'],
        }), Link, ListItem, BulletList, OrderedList, Heading.configure({levels: [1, 2, 3]}), Image, Table.configure({
            resizable: true,
        }), TableRow, TableCell, TableHeader,], content: '<p>Initial content</p>',
    });
    useEffect(() => {
        QuestionsAdministrationService.getQuestion(id)
            .then(response => {
                const question = response.data;
                setQuestionType(question.questionType);
                setSubQuestions(question.subQuestions || []);
                const formattedFileTypes = question.fileTypesList ? question.fileTypesList.map(type => ({type})) : [{type: ""}];
                setFileTypes(formattedFileTypes);
                updateFormData(currentFormData => ({
                    ...currentFormData, ...question,
                    categoryId: question.category?.id,
                    labelIds: question.labels?.map(label => label.id) || [],
                    subQuestions: question.subQuestions || currentFormData.subQuestions,
                    fileTypesList: formattedFileTypes,
                    answerText: question.answer?.text,
                    answerFraction: question.answer?.fraction,
                    answerFeedback: question.answer?.feedback,
                    answerFormat: question.answer?.answerFormat,
                    feedbackFormat: question.answer?.feedbackFormat,
                }));
            })
            .catch(error => {
                console.error("Error fetching question:", error);
            });
        if (editor && formData.questionText) {
            editor.commands.setContent(formData.questionText);
        }
    }, [editor, formData.questionText, id]);
    const renderToolbar = () => {
        if (!editor) {
            return null;
        }
        return (<div className="toolbar">
            <button onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'is-active' : ''}>
                <i className="fas fa-bold"></i>
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'is-active' : ''}>
                <i className="fas fa-italic"></i>
            </button>
            <button onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={editor.isActive('underline') ? 'is-active' : ''}>
                <i className="fas fa-underline"></i>
            </button>
            {[1, 2, 3].map((level) => (
                <button key={level} onClick={() => editor.chain().focus().toggleHeading({level}).run()}
                        className={editor.isActive('heading', {level}) ? 'is-active' : ''}>
                    H{level}
                </button>))}
            <button onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'is-active' : ''}>
                <i className="fas fa-list-ul"></i>
            </button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'is-active' : ''}>
                <i className="fas fa-list-ol"></i>
            </button>
            <button onClick={() => {
                const url = window.prompt('URL');
                editor.chain().focus().setLink({href: url}).run();
            }}>
                <i className="fas fa-link"></i>
            </button>
            <button onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={editor.isActive({textAlign: 'left'}) ? 'is-active' : ''}>
                <i className="fas fa-align-left"></i>
            </button>
            <button onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={editor.isActive({textAlign: 'center'}) ? 'is-active' : ''}>
                <i className="fas fa-align-center"></i>
            </button>
            <button onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={editor.isActive({textAlign: 'right'}) ? 'is-active' : ''}>
                <i className="fas fa-align-right"></i>
            </button>
            <button onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    className={editor.isActive({textAlign: 'justify'}) ? 'is-active' : ''}>
                <i className="fas fa-align-justify"></i>
            </button>
            <button
                type="button"
                onClick={() => {
                    const url = window.prompt('Image URL');
                    if (url) {
                        editor.chain().focus().setImage({src: url}).run();
                    }
                }}
                className={editor.isActive('image') ? 'is-active' : ''}>
                <i className="fas fa-image"></i>
            </button>
            <button
                type="button"
                onClick={() => {
                    editor.chain().focus().insertTable({rows: 3, cols: 3, withHeaderRow: true}).run();
                }}
                className={editor.isActive('table') ? 'is-active' : ''}
            >
                <i className="fas fa-table"></i>
            </button>
            <br/>
            <button type="button" onClick={() => setShowMCModal(true)}>Add Multiple Choice</button>
            <button type="button" onClick={() => setShowSAModal(true)}>Add Short Answer</button>
            <button type="button" onClick={() => setShowNUMModal(true)}>Add Numerical Question</button>
            <button type="button" onClick={() => setShowMultiResponseModal(true)}>Add MultiResponse Question</button>
        </div>);
    };
    const [showNUMModal, setShowNUMModal] = useState(false);
    const [numDetails, setNUMDetails] = useState({
        points: 1, answer: 0, tolerance: 0,
    });
    const handleNUMChange = (e, field) => {
        if (field === 'points') {
            const newPoints = Math.max(1, parseInt(e.target.value, 10) || 1);
            setNUMDetails(prevDetails => ({...prevDetails, points: newPoints}));
        } else if (field === 'answer') {
            const newAnswer = parseFloat(e.target.value) || 0;
            setNUMDetails(prevDetails => ({...prevDetails, answer: newAnswer}));
        } else if (field === 'tolerance') {
            const newTolerance = parseFloat(e.target.value) || 0;
            setNUMDetails(prevDetails => ({...prevDetails, tolerance: newTolerance}));
        }
    };
    const submitNUMModal = () => {
        let placeholder = `{${numDetails.points}:NUMERICAL:=${numDetails.answer}:${numDetails.tolerance}}`;
        editor.commands.insertContent(placeholder);
        setShowNUMModal(false);
    };
    const renderNUMModal = () => (<Modal show={showNUMModal} onHide={() => setShowNUMModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Numerical Question Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group>
                    <Form.Label>Points</Form.Label>
                    <Form.Control type="number" value={numDetails.points}
                                  onChange={(e) => handleNUMChange(e, 'points')}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Answer</Form.Label>
                    <Form.Control
                        type="number"
                        value={numDetails.answer}
                        onChange={(e) => handleNUMChange(e, 'answer')}
                        step="any"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Tolerance</Form.Label>
                    <Form.Control type="text" value={numDetails.tolerance}
                                  onChange={(e) => handleNUMChange(e, 'tolerance')}/>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowNUMModal(false)}>Close</Button>
            <Button variant="primary" onClick={submitNUMModal}>Save Changes</Button>
        </Modal.Footer>
    </Modal>);
    const [showSAModal, setShowSAModal] = useState(false);
    const [saDetails, setSADetails] = useState({
        points: 1, answers: [{text: "", percent: 100}]
    });
    const handleSAChange = (e, index, field) => {
        if (field === 'points') {
            const newPoints = Math.max(1, parseInt(e.target.value, 10) || 1);
            setSADetails(prevDetails => ({...prevDetails, points: newPoints}));
        } else {
            let newAnswers = [...saDetails.answers];
            if (field === 'text') {
                newAnswers[index].text = e.target.value;
            } else if (field === 'percent') {
                newAnswers[index].percent = Math.max(0, Math.min(100, parseInt(e.target.value, 10)));
            }
            setSADetails(prevDetails => ({...prevDetails, answers: newAnswers}));
        }
    };
    const addSAOption = () => {
        setSADetails(prevDetails => ({
            ...prevDetails, answers: [...prevDetails.answers, {text: "", percent: 0}]
        }));
    };
    const removeSAOption = (index) => {
        let filteredAnswers = saDetails.answers.filter((_, i) => i !== index);
        setSADetails(prevDetails => ({...prevDetails, answers: filteredAnswers}));
    };
    const submitSAModal = () => {
        let placeholder = `{${saDetails.points}:SA:=${saDetails.answers[0].text}`;
        saDetails.answers.slice(1).forEach(answer => {
            if (answer.text.trim() !== '') {
                placeholder += `~%${answer.percent}%${answer.text}`;
            }
        });
        placeholder += '}';
        editor.commands.insertContent(placeholder);
        setShowSAModal(false);
    };
    const renderSAModal = () => (<Modal show={showSAModal} onHide={() => setShowSAModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Short Answer Question Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group>
                    <Form.Label>Points</Form.Label>
                    <Form.Control type="number" value={saDetails.points}
                                  onChange={(e) => handleSAChange(e, null, 'points')}/>
                </Form.Group>
                <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                    {saDetails.answers.map((answer, index) => (<div key={index} style={{marginBottom: '10px'}}>
                        <Form.Group>
                            <Form.Label>Answer {index + 1} Text</Form.Label>
                            <Form.Control
                                type="text"
                                value={answer.text}
                                onChange={(e) => handleSAChange(e, index, 'text')}
                            />
                        </Form.Group>
                        {index !== 0 && (<Form.Group>
                            <Form.Label>Answer {index + 1} Percent</Form.Label>
                            <Form.Control
                                type="number"
                                value={answer.percent}
                                min="0"
                                max="100"
                                onChange={(e) => handleSAChange(e, index, 'percent')}
                            />
                        </Form.Group>)}
                        {index !== 0 && (<Button
                            variant="danger"
                            onClick={() => removeSAOption(index)}
                            style={{marginTop: '5px', marginLeft: '2px'}}
                        >
                            Remove Option {index + 1}
                        </Button>)}
                    </div>))}
                </div>
                <Button variant="secondary" onClick={addSAOption} style={{marginTop: '10px'}}>Add Option</Button>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSAModal(false)}>Close</Button>
            <Button variant="primary" onClick={submitSAModal}>Save Changes</Button>
        </Modal.Footer>
    </Modal>);
    const [showMCModal, setShowMCModal] = useState(false);
    const [mcDetails, setMCDetails] = useState({
        points: 1, options: [{text: '', percent: 100}],
    });
    const handleMCChange = (e, index, field) => {
        if (field === 'points') {
            const newPoints = Math.max(1, parseInt(e.target.value, 10) || 1);
            setMCDetails(prevDetails => ({...prevDetails, points: newPoints}));
        } else if (index != null) {
            let newOptions = [...mcDetails.options];
            newOptions[index][field] = e.target.value;
            setMCDetails(prevDetails => ({...prevDetails, options: newOptions}));
        }
    };
    const addMCOption = () => {
        setMCDetails({...mcDetails, options: [...mcDetails.options, {text: '', percent: 0}]});
    };
    const removeMCOption = (index) => {
        let filteredOptions = mcDetails.options.filter((_, i) => i !== index);
        setMCDetails({...mcDetails, options: filteredOptions});
    };
    const submitMCModal = () => {
        let placeholder = `{${mcDetails.points}:MC:`;
        mcDetails.options.forEach(option => {
            const percent = Math.max(0, Math.min(100, option.percent));
            placeholder += `~%${percent}%${option.text}`;
        });
        placeholder += "}";

        editor.commands.insertContent(placeholder);
        setQuestionPoints(mcDetails.points);
        setShowMCModal(false);
    };
    const renderMCModal = () => (<Modal show={showMCModal} onHide={() => setShowMCModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Multiple Choice Question Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group>
                    <Form.Label>Points</Form.Label>
                    <Form.Control type="number" value={mcDetails.points}
                                  onChange={(e) => handleMCChange(e, null, 'points')}/>
                </Form.Group>

                {/* Scrollable container for options */}
                <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                    {mcDetails.options.map((option, index) => (<div key={index} style={{marginBottom: '10px'}}>
                        <Form.Group>
                            <Form.Label>Option {index + 1} Text</Form.Label>
                            <Form.Control
                                type="text"
                                value={option.text}
                                onChange={(e) => handleMCChange(e, index, 'text')}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Option {index + 1} Percent</Form.Label>
                            <Form.Control
                                type="number"
                                value={option.percent}
                                min="0"
                                max="100"
                                onChange={(e) => handleMCChange(e, index, 'percent')}
                            />
                        </Form.Group>
                        <Button
                            variant="danger"
                            onClick={() => removeMCOption(index)}
                            style={{marginTop: '5px', marginLeft: '2px'}}
                        >
                            Remove Option {index + 1}
                        </Button>
                    </div>))}
                </div>

                <Button variant="secondary" onClick={addMCOption} style={{marginTop: '10px'}}>Add Option</Button>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowMCModal(false)}>Close</Button>
            <Button variant="primary" onClick={submitMCModal}>Save Changes</Button>
        </Modal.Footer>
    </Modal>);
    const addSubQuestion = () => {
        const newSubQuestion = {text: "", answer: "", subQuestionFormat: "HTML"};
        setSubQuestions([...subQuestions, newSubQuestion]);
    };
    const removeSubQuestion = (index) => {
        setSubQuestions(subQuestions.filter((_, subIndex) => subIndex !== index));
    };
    const handleSubQuestionDetailChange = (index, field, value) => {
        const updatedSubQuestions = subQuestions.map((sq, i) => {
            if (i === index) {
                return {...sq, [field]: value};
            }
            return sq;
        });
        setSubQuestions(updatedSubQuestions);
    };
    const handleAnswerChange = (index, field, value) => {
        const updatedAnswerOptions = formData.answerOptions.map((answer, answerIndex) => {
            if (index === answerIndex) {
                return {...answer, [field]: value};
            }
            return answer;
        });
        updateFormData({...formData, answerOptions: updatedAnswerOptions});
    };
    const addAnswerOption = () => {
        const newAnswerOption = {
            fraction: 0.0, text: "", feedback: "", answerFormat: 'HTML', feedbackFormat: 'HTML'
        };
        const updatedAnswerOptions = [...formData.answerOptions, newAnswerOption];
        updateFormData({...formData, answerOptions: updatedAnswerOptions});
    };
    const removeAnswerOption = (index) => {
        const updatedAnswerOptions = formData.answerOptions.filter((_, answerIndex) => index !== answerIndex);
        updateFormData({...formData, answerOptions: updatedAnswerOptions});
    };
    const addFileType = () => {
        const newFileType = {type: ""};
        setFileTypes([...fileTypes, newFileType]);
    };
    const removeFileType = (index) => {
        setFileTypes(fileTypes.filter((_, i) => i !== index));
    };
    const handleFileTypeChange = (index, value) => {
        const updatedFileTypes = fileTypes.map((fileType, i) => {
            if (i === index) {
                return {...fileType, type: value};
            }
            return fileType;
        });
        setFileTypes(updatedFileTypes);
    };
    const constructQuestionData = () => {
        switch (questionType) {
            case 'EssayQuestion':
                return {
                    ...formData,
                    defaultGrade: formData.defaultGrade,
                    responseFormat: formData.responseFormat,
                    responseRequired: formData.responseRequired,
                    responseFieldLines: formData.responseFieldLines,
                    minWordLimit: formData.minWordLimit,
                    maxWordLimit: formData.maxWordLimit,
                    attachments: formData.attachments,
                    attachmentsRequired: formData.attachmentsRequired,
                    maxBytes: formData.maxBytes,
                    fileTypesList: fileTypes,
                    graderInfo: formData.graderInfo,
                    graderInfoFormat: formData.graderInfoFormat,
                    responseTemplate: formData.responseTemplate,
                    responseTemplateFormat: formData.responseTemplateFormat
                };
            case 'MatchingQuestion':
                return {
                    ...formData,
                    defaultGrade: formData.defaultGrade,
                    shuffleAnswers: formData.shuffleAnswers,
                    correctFeedback: formData.correctFeedback,
                    correctFeedbackFormat: formData.correctFeedbackFormat,
                    partiallyCorrectFeedback: formData.partiallyCorrectFeedback,
                    partiallyCorrectFeedbackFormat: formData.partiallyCorrectFeedbackFormat,
                    incorrectFeedback: formData.incorrectFeedback,
                    incorrectFeedbackFormat: formData.incorrectFeedbackFormat,
                    showNumCorrect: formData.showNumCorrect,
                    subQuestions: subQuestions,
                };
            case 'MultiChoiceQuestion':
                return {
                    ...formData,
                    defaultGrade: formData.defaultGrade,
                    single: formData.single,
                    shuffleAnswers: formData.shuffleAnswers,
                    answerNumbering: formData.answerNumbering,
                    showStandardInstruction: formData.showStandardInstruction,
                    correctFeedback: formData.correctFeedback,
                    correctFeedbackFormat: formData.correctFeedbackFormat,
                    partiallyCorrectFeedback: formData.partiallyCorrectFeedback,
                    partiallyCorrectFeedbackFormat: formData.partiallyCorrectFeedbackFormat,
                    incorrectFeedback: formData.incorrectFeedback,
                    incorrectFeedbackFormat: formData.incorrectFeedbackFormat,
                    showNumCorrect: formData.showNumCorrect,
                    answerOptions: formData.answerOptions.map(option => ({
                        fraction: option.fraction,
                        answerFormat: option.answerFormat,
                        text: option.text,
                        feedback: option.feedback,
                        feedbackFormat: option.feedbackFormat,
                    })),
                };
            case 'ShortAnswerQuestion':
                return {
                    ...formData, defaultGrade: formData.defaultGrade, useCase: formData.useCase, answer: {
                        text: formData.answerText,
                        fraction: formData.answerFraction,
                        feedback: formData.answerFeedback,
                        answerFormat: formData.answerFormat,
                        feedbackFormat: formData.feedbackFormat
                    }
                };
            default:
                return {...formData};
        }
    };
    const validateFields = () => {
        let isValid = true;
        if (formData.responseFieldLines % 1 !== 0) {
            alert('Response Field Lines must be an integer.');
            isValid = false;
        }
        if (formData.minWordLimit % 1 !== 0) {
            alert('Minimum Word Limit must be an integer.');
            isValid = false;
        }
        if (formData.maxWordLimit % 1 !== 0) {
            alert('Maximum Word Limit must be an integer.');
            isValid = false;
        }
        if (formData.attachments % 1 !== 0) {
            alert('Number of Attachments must be an integer.');
            isValid = false;
        }
        if (formData.attachmentsRequired % 1 !== 0) {
            alert('Number of Attachments Required must be an integer.');
            isValid = false;
        }
        if (formData.maxBytes % 1 !== 0) {
            alert('Maximum Bytes must be an integer.');
            isValid = false;
        }
        return isValid;
    };
    const onFormSubmit = (e) => {
        e.preventDefault();

        if (!validateFields()) {
            return;
        }

        formData.questionText = editor.getHTML();
        const fileTypesAsStrings = fileTypes.map(fileType => fileType.type);
        const questionData = constructQuestionData();
        questionData.fileTypesList = fileTypesAsStrings;
        const questionWrapper = {
            questionType: questionType, questionData: questionData
        };
        props.onEditQuestion(id, questionWrapper);
        history.push("/questions");
    };
    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.type === 'select-multiple' ? Array.from(e.target.selectedOptions, option => option.value) : e.target.value;
        updateFormData({
            ...formData, [e.target.name]: value,
        });
    };
    const handleTypeChange = (e) => {
        setQuestionType(e.target.value);
        updateFormData({
            ...formData, questionType: e.target.value, [e.target.name]: e.target.value
        });
    };

    const renderFileTypes = () => (<div>
        {fileTypes.map((fileType, index) => (<div key={index}>
            <Row>
                <Col md={10}>
                    <div className="form-group">
                        <label htmlFor={`fileType-${index}`}>File Type {index + 1}</label>
                        <input
                            type="text"
                            className="form-control"
                            id={`fileType-${index}`}
                            value={fileType.type}
                            onChange={(e) => handleFileTypeChange(index, e.target.value)}
                            placeholder="Enter file type (e.g., .pdf, .docx)"
                        />
                    </div>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                    <button type="button" className="btn btn-danger"
                            onClick={() => removeFileType(index)}>Remove
                    </button>
                </Col>
            </Row>
        </div>))}
        <button type="button" className="btn btn-primary mt-2 mb-2" onClick={addFileType}>Add File Type</button>
    </div>);
    const renderSubQuestions = () => {
        return (<>
            {subQuestions.map((subQuestion, index) => (<div key={index}>
                <Row>
                    <Col md={3}>
                        <div className="form-group">
                            <label htmlFor={`subQuestionText-${index}`}>Sub Question {index + 1} Text</label>
                            <input
                                type="text"
                                className="form-control"
                                id={`subQuestionText-${index}`}
                                value={subQuestion.text}
                                onChange={(e) => handleSubQuestionDetailChange(index, 'text', e.target.value)}
                                placeholder="Enter Sub Question Text"
                            />
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="form-group">
                            <label htmlFor={`subQuestionAnswer-${index}`}>Answer</label>
                            <input
                                type="text"
                                className="form-control"
                                id={`subQuestionAnswer-${index}`}
                                value={subQuestion.answer}
                                onChange={(e) => handleSubQuestionDetailChange(index, 'answer', e.target.value)}
                                placeholder="Enter Sub Question Answer"
                            />
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="form-group">
                            <label htmlFor={`subQuestionFormat-${index}`}>Format</label>
                            <select
                                className="form-control"
                                id={`subQuestionFormat-${index}`}
                                value={subQuestion.subQuestionFormat}
                                onChange={(e) => handleSubQuestionDetailChange(index, 'subQuestionFormat', e.target.value)}
                            >
                                <option value="HTML">HTML</option>
                                <option value="PLAIN_TEXT">Plain Text</option>
                                <option value="MARKDOWN">Markdown</option>
                                <option value="MOODLE_AUTO_FORMAT">Moodle Auto Format</option>
                            </select>
                        </div>
                    </Col>
                    <Col md={3} className="d-flex align-items-end">
                        <button type="button" className="btn btn-danger"
                                onClick={() => removeSubQuestion(index)}>
                            Remove Sub Question {index + 1}
                        </button>
                    </Col>
                </Row>
            </div>))}
            <Row>
                <Col md={12}>
                    <button type="button" onClick={addSubQuestion} className="btn btn-primary mt-2 mb-2">
                        Add Sub Question
                    </button>
                </Col>
            </Row>
        </>);
    };
    const renderAnswerOptions = () => {
        return (<>
            {formData.answerOptions.map((answer, index) => (<Row key={index} className="mb-3">
                <Col md={3}>
                    <div className="form-group">
                        <label htmlFor={`answerFraction-${index}`}>Answer Fraction</label>
                        <input
                            type="number"
                            className="form-control"
                            id={`answerFraction-${index}`}
                            value={answer.fraction}
                            step="any"
                            onChange={(e) => handleAnswerChange(index, 'fraction', e.target.value)}
                        />
                    </div>
                </Col>
                <Col md={2}>
                    <div className="form-group">
                        <label htmlFor={`answerFormat-${index}`}>Format</label>
                        <select
                            className="form-control"
                            id={`answerFormat-${index}`}
                            value={answer.answerFormat}
                            onChange={(e) => handleAnswerChange(index, 'answerFormat', e.target.value)}
                        >
                            <option value="HTML">HTML</option>
                            <option value="PLAIN_TEXT">Plain Text</option>
                            <option value="MARKDOWN">Markdown</option>
                            <option value="MOODLE_AUTO_FORMAT">Moodle Auto Format</option>
                        </select>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="form-group">
                        <label htmlFor={`answerText-${index}`}>Answer Text</label>
                        <input
                            type="text"
                            className="form-control"
                            id={`answerText-${index}`}
                            value={answer.text}
                            onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                        />
                    </div>
                </Col>
                <Col md={3}>
                    <div className="form-group">
                        <label htmlFor={`answerFeedback-${index}`}>Feedback</label>
                        <input
                            type="text"
                            className="form-control"
                            id={`answerFeedback-${index}`}
                            value={answer.feedback}
                            onChange={(e) => handleAnswerChange(index, 'feedback', e.target.value)}
                        />
                    </div>
                </Col>
                <Col md={1} className="d-flex align-items-end">
                    <button type="button" className="btn btn-danger" onClick={() => removeAnswerOption(index)}>
                        Remove
                    </button>
                </Col>
            </Row>))}
            <Row>
                <Col md={12}>
                    <button type="button" className="btn btn-primary mt-2 mb-2" onClick={addAnswerOption}>
                        Add Answer Option
                    </button>
                </Col>
            </Row>
        </>);
    };

    const [showMultiResponseModal, setShowMultiResponseModal] = useState(false);
    const [multiResponseDetails, setMultiResponseDetails] = useState({
        points: 1, options: [{text: '', percent: 100}],
    });
    const handleMultiResponseChange = (e, index, field) => {
        const value = field === 'percent' ? parseFloat(e.target.value) : e.target.value;
        let newOptions = [...multiResponseDetails.options];
        newOptions[index][field] = value;
        setMultiResponseDetails({...multiResponseDetails, options: newOptions});
    };


    const addMultiResponseOption = () => {
        setMultiResponseDetails({
            ...multiResponseDetails, options: [...multiResponseDetails.options, {text: '', percent: 0}],
        });
    };
    const removeMultiResponseOption = (index) => {
        let filteredOptions = multiResponseDetails.options.filter((_, i) => i !== index);
        setMultiResponseDetails({...multiResponseDetails, options: filteredOptions});
    };
    const submitMultiResponseModal = () => {
        let placeholder = `{${multiResponseDetails.points}:MULTIRESPONSE:`;
        multiResponseDetails.options.forEach((option, index) => {
            placeholder += `~%${option.percent}%${option.text}`;
        });
        placeholder += '}' ;
        editor.commands.insertContent(placeholder);
        setShowMultiResponseModal(false);
    };

    const renderMultiResponseModal = () => (
        <Modal show={showMultiResponseModal} onHide={() => setShowMultiResponseModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>MultiResponse Question Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Points</Form.Label>
                        <Form.Control
                            type="number"
                            value={multiResponseDetails.points}
                            onChange={(e) => setMultiResponseDetails({ ...multiResponseDetails, points: parseInt(e.target.value, 10) || 0 })}
                        />
                    </Form.Group>
                    {multiResponseDetails.options.map((option, index) => (
                        <div key={index} className="mb-3">
                            <Form.Group>
                                <Form.Label>Option {index + 1} Text</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={option.text}
                                    onChange={(e) => handleMultiResponseChange(e, index, 'text')}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Option {index + 1} Percentage</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="-100"
                                    max="100"
                                    step="0.01"
                                    value={option.percent}
                                    onChange={(e) => handleMultiResponseChange(e, index, 'percent')}
                                />
                            </Form.Group>
                            {index > 0 && (
                                <Button variant="danger" onClick={() => removeMultiResponseOption(index)}>
                                    Remove Option {index + 1}
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button onClick={addMultiResponseOption} className="mt-3">Add Option</Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowMultiResponseModal(false)}>Close</Button>
                <Button variant="primary" onClick={submitMultiResponseModal}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    );
    return (<div className="container">
        {renderMCModal()}
        {renderSAModal()}
        {renderNUMModal()}
        {renderMultiResponseModal()}
        <form onSubmit={onFormSubmit}>
            <Row className="d-flex align-items-center">
                <Col md={10}>
                    <h2>Edit Question</h2>
                    <div className="form-group">
                        <label>Question Type: {questionType}</label>
                    </div>
                </Col>
                <Col md={2} className="d-flex justify-content-end">
                    <Form.Check
                        type="checkbox"
                        id="detailedViewToggle"
                        label="Detailed View"
                        checked={showDetails}
                        onChange={() => setShowDetails(!showDetails)}
                        className="mt-2"
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="form-group">
                        <label htmlFor="name">Question Name</label>
                        <input type="text" className="form-control" id="name" name="name" required
                               placeholder="Enter Question Name" value={formData.name} onChange={handleChange}/>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="form-group">
                        <label htmlFor="questionText">Question Text</label>
                        <div>
                            {renderToolbar()}
                            <EditorContent editor={editor}/>
                        </div>
                    </div>
                </Col>
            </Row>
            {showDetails && (<Row>
                <Col md={6}>
                    <div className="form-group">
                        <label htmlFor="questionTextFormat">Question Text Format</label>
                        <select className="form-control" id="questionTextFormat" name="questionTextFormat"
                                value={formData.questionTextFormat} onChange={handleChange}>
                            <option value="HTML">HTML</option>
                            <option value="MOODLE_AUTO_FORMAT">Moodle Auto Format</option>
                            <option value="PLAIN_TEXT">Plain Text</option>
                            <option value="MARKDOWN">Markdown</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="generalFeedback">General Feedback</label>
                        <input type="text" className="form-control" id="generalFeedback" name="generalFeedback"
                               placeholder="Enter General Feedback" value={formData.generalFeedback}
                               onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="generalFeedbackFormat">General Feedback Format</label>
                        <select className="form-control" id="generalFeedbackFormat" name="generalFeedbackFormat"
                                value={formData.generalFeedbackFormat} onChange={handleChange}>
                            <option value="HTML">HTML</option>
                            <option value="MOODLE_AUTO_FORMAT">Moodle Auto Format</option>
                            <option value="PLAIN_TEXT">Plain Text</option>
                            <option value="MARKDOWN">Markdown</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="penalty">Penalty</label>
                        <input type="number" className="form-control" id="penalty" name="penalty"
                               placeholder="Enter Penalty" value={formData.penalty} onChange={handleChange} step="any"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="hidden">Hidden</label>
                        <input type="checkbox" id="hidden" name="hidden" checked={formData.hidden}
                               onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="idNumber">ID Number</label>
                        <input type="text" className="form-control" id="idNumber" name="idNumber"
                               placeholder="Enter ID Number" value={formData.idNumber} onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="categoryId" className="form-control" onChange={handleChange}
                                value={formData.categoryId}>
                            {props.categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Labels</label>
                        <select name="labelIds" className="form-control" onChange={handleChange} multiple
                                value={formData.labelIds}>
                            {props.labels.map((label) => (
                                <option key={label.id} value={label.id}>{label.name}</option>))}
                        </select>
                    </div>
                </Col>
                <Col md={6}>
                    {questionType === 'EssayQuestion' && (<>
                        <div className="form-group">
                            <label htmlFor="defaultGrade">Default Grade</label>
                            <input type="number" className="form-control" id="defaultGrade" name="defaultGrade"
                                   placeholder="Enter Default Grade" value={formData.defaultGrade}
                                   onChange={handleChange} step="any"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="responseFormat">Response Format</label>
                            <input type="text" className="form-control" id="responseFormat" name="responseFormat"
                                   placeholder="Enter Response Format" value={formData.responseFormat}
                                   onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="responseRequired">Response Required</label>
                            <input type="checkbox" id="responseRequired" name="responseRequired"
                                   checked={formData.responseRequired} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="responseFieldLines">Response Field Lines</label>
                            <input type="number" className="form-control" id="responseFieldLines"
                                   name="responseFieldLines" placeholder="Enter Response Field Lines" step="1"
                                   value={formData.responseFieldLines} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="minWordLimit">Minimum Word Limit</label>
                            <input type="number" className="form-control" id="minWordLimit" name="minWordLimit" step="1"
                                   placeholder="Enter Minimum Word Limit" value={formData.minWordLimit}
                                   onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="maxWordLimit">Maximum Word Limit</label>
                            <input type="number" className="form-control" id="maxWordLimit" name="maxWordLimit" step="1"
                                   placeholder="Enter Maximum Word Limit" value={formData.maxWordLimit}
                                   onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="attachments">Attachments</label>
                            <input type="number" className="form-control" id="attachments" name="attachments" step="1"
                                   placeholder="Enter Number of Attachments" value={formData.attachments}
                                   onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="attachmentsRequired">Attachments Required</label>
                            <input type="number" className="form-control" id="attachmentsRequired"
                                   name="attachmentsRequired" placeholder="Enter Number of Attachments Required"
                                   step="1"
                                   value={formData.attachmentsRequired} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="maxBytes">Maximum Bytes</label>
                            <input type="number" className="form-control" id="maxBytes" name="maxBytes" step="1"
                                   placeholder="Enter Maximum Bytes" value={formData.maxBytes}
                                   onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="graderInfo">Grader Information</label>
                            <textarea className="form-control" id="graderInfo" name="graderInfo"
                                      placeholder="Enter Grader Information" value={formData.graderInfo}
                                      onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="graderInfoFormat">Grader Information Format</label>
                            <select className="form-control" id="graderInfoFormat" name="graderInfoFormat"
                                    value={formData.graderInfoFormat} onChange={handleChange}>
                                <option value="HTML">HTML</option>
                                <option value="MOODLE_AUTO_FORMAT">Moodle Auto Format</option>
                                <option value="PLAIN_TEXT">Plain Text</option>
                                <option value="MARKDOWN">Markdown</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="responseTemplate">Response Template</label>
                            <textarea className="form-control" id="responseTemplate" name="responseTemplate"
                                      placeholder="Enter Response Template" value={formData.responseTemplate}
                                      onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="responseTemplateFormat">Response Template Format</label>
                            <select className="form-control" id="responseTemplateFormat" name="responseTemplateFormat"
                                    value={formData.responseTemplateFormat} onChange={handleChange}>
                                <option value="HTML">HTML</option>
                                <option value="MOODLE_AUTO_FORMAT">Moodle Auto Format</option>
                                <option value="PLAIN_TEXT">Plain Text</option>
                                <option value="MARKDOWN">Markdown</option>
                            </select>
                        </div>
                    </>)}
                    {questionType === 'MatchingQuestion' && (<>
                        <div className="form-group">
                            <label htmlFor="defaultGrade">Default Grade</label>
                            <input type="number" className="form-control" id="defaultGrade" name="defaultGrade"
                                   placeholder="Enter Default Grade" value={formData.defaultGrade}
                                   onChange={handleChange} step="any"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="shuffleAnswers">Shuffle Answers</label>
                            <input type="checkbox" id="shuffleAnswers" name="shuffleAnswers"
                                   checked={formData.shuffleAnswers} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="correctFeedback">Correct Feedback</label>
                            <input type="text" className="form-control" id="correctFeedback" name="correctFeedback"
                                   placeholder="Enter Correct Feedback" value={formData.correctFeedback}
                                   onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="correctFeedbackFormat">Correct Feedback Format</label>
                            <select className="form-control" id="correctFeedbackFormat" name="correctFeedbackFormat"
                                    value={formData.correctFeedbackFormat} onChange={handleChange}>
                                <option value="HTML">HTML</option>
                                <option value="MOODLE_AUTO_FORMAT">Moodle Auto Format</option>
                                <option value="PLAIN_TEXT">Plain Text</option>
                                <option value="MARKDOWN">Markdown</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="partiallyCorrectFeedback">Partially Correct Feedback</label>
                            <input type="text" className="form-control" id="partiallyCorrectFeedback"
                                   name="partiallyCorrectFeedback" placeholder="Enter Partially Correct Feedback"
                                   value={formData.partiallyCorrectFeedback} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="partiallyCorrectFeedbackFormat">Partially Correct Feedback Format</label>
                            <select className="form-control" id="partiallyCorrectFeedbackFormat"
                                    name="partiallyCorrectFeedbackFormat"
                                    value={formData.partiallyCorrectFeedbackFormat} onChange={handleChange}>
                                <option value="HTML">HTML</option>
                                <option value="MOODLE_AUTO_FORMAT">Moodle Auto Format</option>
                                <option value="PLAIN_TEXT">Plain Text</option>
                                <option value="MARKDOWN">Markdown</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="incorrectFeedback">Incorrect Feedback</label>
                            <input type="text" className="form-control" id="incorrectFeedback"
                                   name="incorrectFeedback" placeholder="Enter Incorrect Feedback"
                                   value={formData.incorrectFeedback} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="incorrectFeedbackFormat">Incorrect Feedback Format</label>
                            <select className="form-control" id="incorrectFeedbackFormat" name="incorrectFeedbackFormat"
                                    value={formData.incorrectFeedbackFormat} onChange={handleChange}>
                                <option value="HTML">HTML</option>
                                <option value="MOODLE_AUTO_FORMAT">Moodle Auto Format</option>
                                <option value="PLAIN_TEXT">Plain Text</option>
                                <option value="MARKDOWN">Markdown</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="showNumCorrect">Show Number Correct</label>
                            <input type="checkbox" id="showNumCorrect" name="showNumCorrect"
                                   checked={formData.showNumCorrect} onChange={handleChange}/>
                        </div>
                    </>)}
                    {questionType === 'MultiChoiceQuestion' && (<>
                        <div className="form-group">
                            <label htmlFor="defaultGrade">Default Grade</label>
                            <input type="number" className="form-control" id="defaultGrade" name="defaultGrade"
                                   placeholder="Enter Default Grade" value={formData.defaultGrade}
                                   onChange={handleChange} step="any"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="single">Single Choice</label>
                            <input type="checkbox" id="single" name="single" checked={formData.single}
                                   onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="shuffleAnswers">Shuffle Answers</label>
                            <input type="checkbox" id="shuffleAnswers" name="shuffleAnswers"
                                   checked={formData.shuffleAnswers} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="answerNumbering">Answer Numbering</label>
                            <input type="text" className="form-control" id="answerNumbering" name="answerNumbering"
                                   placeholder="Enter Answer Numbering" value={formData.answerNumbering}
                                   onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="showStandardInstruction">Show Standard Instruction</label>
                            <input type="checkbox" id="showStandardInstruction" name="showStandardInstruction"
                                   checked={formData.showStandardInstruction} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="correctFeedback">Correct Feedback</label>
                            <input type="text" className="form-control" id="correctFeedback" name="correctFeedback"
                                   placeholder="Enter Correct Feedback" value={formData.correctFeedback}
                                   onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="correctFeedbackFormat">Correct Feedback Format</label>
                            <select className="form-control" id="correctFeedbackFormat" name="correctFeedbackFormat"
                                    value={formData.correctFeedbackFormat} onChange={handleChange}>
                                <option value="HTML">HTML</option>
                                <option value="MOODLE_AUTO_FORMAT">Moodle Auto Format</option>
                                <option value="PLAIN_TEXT">Plain Text</option>
                                <option value="MARKDOWN">Markdown</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="partiallyCorrectFeedback">Partially Correct Feedback</label>
                            <input type="text" className="form-control" id="partiallyCorrectFeedback"
                                   name="partiallyCorrectFeedback" placeholder="Enter Partially Correct Feedback"
                                   value={formData.partiallyCorrectFeedback} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="partiallyCorrectFeedbackFormat">Partially Correct Feedback Format</label>
                            <select className="form-control" id="partiallyCorrectFeedbackFormat"
                                    name="partiallyCorrectFeedbackFormat"
                                    value={formData.partiallyCorrectFeedbackFormat} onChange={handleChange}>
                                <option value="HTML">HTML</option>
                                <option value="MOODLE_AUTO_FORMAT">Moodle Auto Format</option>
                                <option value="PLAIN_TEXT">Plain Text</option>
                                <option value="MARKDOWN">Markdown</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="incorrectFeedback">Incorrect Feedback</label>
                            <input type="text" className="form-control" id="incorrectFeedback"
                                   name="incorrectFeedback" placeholder="Enter Incorrect Feedback"
                                   value={formData.incorrectFeedback} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="incorrectFeedbackFormat">Incorrect Feedback Format</label>
                            <select className="form-control" id="incorrectFeedbackFormat" name="incorrectFeedbackFormat"
                                    value={formData.incorrectFeedbackFormat} onChange={handleChange}>
                                <option value="HTML">HTML</option>
                                <option value="MOODLE_AUTO_FORMAT">Moodle Auto Format</option>
                                <option value="PLAIN_TEXT">Plain Text</option>
                                <option value="MARKDOWN">Markdown</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="showNumCorrect">Show Number Correct</label>
                            <input type="checkbox" id="showNumCorrect" name="showNumCorrect"
                                   checked={formData.showNumCorrect} onChange={handleChange}/>
                        </div>
                    </>)}
                    {questionType === 'ShortAnswerQuestion' && (<>
                        <div className="form-group">
                            <label htmlFor="defaultGrade">Default Grade</label>
                            <input type="number" className="form-control" id="defaultGrade" name="defaultGrade"
                                   placeholder="Enter Default Grade" value={formData.defaultGrade}
                                   onChange={handleChange} step="any"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="useCase">Use Case</label>
                            <input type="checkbox" id="useCase" name="useCase" checked={formData.useCase}
                                   onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="answerText">Answer Text</label>
                            <input type="text" className="form-control" id="answerText" name="answerText"
                                   placeholder="Enter Answer Text" value={formData.answerText}
                                   onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="answerFraction">Answer Fraction</label>
                            <input type="number" className="form-control" id="answerFraction"
                                   name="answerFraction" placeholder="Enter Answer Fraction" step="any"
                                   value={formData.answerFraction} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="answerFeedback">Answer Feedback</label>
                            <input type="text" className="form-control" id="answerFeedback"
                                   name="answerFeedback" placeholder="Enter Answer Feedback"
                                   value={formData.answerFeedback} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="answerFormat">Answer Format</label>
                            <select className="form-control" id="answerFormat" name="answerFormat"
                                    value={formData.answerFormat} onChange={handleChange}>
                                <option value="HTML">HTML</option>
                                <option value="PLAIN_TEXT">Plain Text</option>
                                <option value="MARKDOWN">Markdown</option>
                                <option value="MOODLE_AUTO_FORMAT">Moodle Auto Format</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="feedbackFormat">Feedback Format</label>
                            <select className="form-control" id="feedbackFormat" name="feedbackFormat"
                                    value={formData.feedbackFormat} onChange={handleChange}>
                                <option value="HTML">HTML</option>
                                <option value="PLAIN_TEXT">Plain Text</option>
                                <option value="MARKDOWN">Markdown</option>
                                <option value="MOODLE_AUTO_FORMAT">Moodle Auto Format</option>
                            </select>
                        </div>
                    </>)}
                </Col>
            </Row>)}
            {showDetails && (<Row>
                <Col>
                    {questionType === 'EssayQuestion' && renderFileTypes()}
                    {questionType === 'MatchingQuestion' && renderSubQuestions()}
                    {questionType === 'MultiChoiceQuestion' && renderAnswerOptions()}
                </Col>
            </Row>)}
            <Row>
                <Col>
                    <button id="submit" type="submit" className="btn btn-primary mt-2">Submit</button>
                </Col>
            </Row>
        </form>
    </div>);
};

export default QuestionEdit;