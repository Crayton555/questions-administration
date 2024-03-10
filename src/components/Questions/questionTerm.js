import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useHistory} from 'react-router-dom';

const QuestionTerm = (props) => {
    const [editingLabelId, setEditingLabelId] = useState(null);
    const [newLabelName, setNewLabelName] = useState('');
    const [showAddLabelInput, setShowAddLabelInput] = useState(false);
    const history = useHistory();

    const handleLabelNameChange = (event) => {
        setNewLabelName(event.target.value);
    };
    const handleLabelEdit = (labelId, labelName) => {
        setEditingLabelId(labelId);
        setNewLabelName(labelName);
    };
    const handleAddLabel = () => {
        if (newLabelName.trim()) {
            props.onAddNewLabelToQuestion(props.term.id, newLabelName);
            setNewLabelName('');
            setShowAddLabelInput(false);
        }
    };
    const saveLabelEdit = () => {
        if (editingLabelId !== null && newLabelName.trim()) {
            props.onEditLabel(editingLabelId, newLabelName);
            setEditingLabelId(null);
            setNewLabelName('');
        }
    };
    const renderLabels = () => {
        return props.term.labels?.map((label) => (<span key={label.id} style={{
            cursor: 'pointer',
            border: '1px solid #ccc',
            padding: '2px 4px',
            margin: '2px',
            borderRadius: '4px',
            display: 'inline-block'
        }}>
                {editingLabelId === label.id ? (<input
                    type="text"
                    value={newLabelName}
                    onChange={handleLabelNameChange}
                    onBlur={saveLabelEdit}
                />) : (<span onClick={() => handleLabelEdit(label.id, label.name)}>{label.name}</span>)}
            </span>));
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddLabel();
        }
    };

    function parseMCOptions(optionString) {
        // Splitting the content by '~' to separate options
        const options = optionString.split('~')
            .filter(opt => opt.trim()) // Filter out empty or whitespace-only strings
            .map(opt => {
                // Extracting the text part after the last '%', or the whole string if no '%' is present
                const parts = opt.match(/(?:%(\d+)%)?(.*)/);
                return parts && parts[2] ? parts[2].trim() : ""; // Return the text part
            });

        // Constructing a dropdown menu for MC options
        let selectHtml = `<select style="margin-left: 5px; margin-right: 5px;">`;
        options.forEach((option) => {
            if (option) { // Ensure non-empty options are added
                selectHtml += `<option value="${option}">${option}</option>`;
            }
        });
        selectHtml += `</select>`;
        return selectHtml;
    }

    function replaceEmbeddedQuestions(questionText) {
        const pattern = /{(\d+):(NM|NUMERICAL|SA|MC):=?([\s\S]*?)}/gs;

        return questionText.replace(pattern, (match, p1, p2, p3) => {
            if (p2 === "NM" || p2 === "NUMERICAL") {
                return `<input type="number" placeholder="${p3 || 'Enter number'}" style="margin-left: 5px; margin-right: 5px;">`;
            } else if (p2 === "SA") {
                return `<input type="text" placeholder="${p3 || 'Enter answer'}" style="margin-left: 5px; margin-right: 5px;">`;
            } else if (p2 === "MC") {
                return parseMCOptions(p3);
            }
            return match; // If it doesn't match NM, SA or MC, return the original text
        });
    }

    return (<tr>
        <td>{props.term.name}</td>
        <td dangerouslySetInnerHTML={{__html: replaceEmbeddedQuestions(props.term.questionText)}}
            style={{cursor: 'pointer'}}>
        </td>
        <td>{props.term.category?.name || 'No Category'}</td>
        <td>
            {renderLabels()}
            {showAddLabelInput ? (<div>
                <input
                    type="text"
                    value={newLabelName}
                    onChange={handleLabelNameChange}
                    onKeyPress={handleKeyPress}
                />
            </div>) : (<button onClick={() => setShowAddLabelInput(true)} style={{marginLeft: '5px'}}>+</button>)}
        </td>
        <td className={"text-right"}>
            <a title={"Delete"} className={"btn btn-danger"}
               onClick={() => props.onDelete(props.term.id)}>
                Delete
            </a>
            <Link className={"btn btn-info ml-2"}
                  onClick={() => props.onEdit(props.term.id)}
                  to={`/questions/edit/${props.term.id}`}>
                Edit
            </Link>
        </td>
    </tr>);
};

export default QuestionTerm;