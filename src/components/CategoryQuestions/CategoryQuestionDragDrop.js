import React, {useState, useEffect} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import QuestionsAdministrationService from '../../repository/questionsAdministrationRepository';

const CategoryQuestionDragDrop = () => {
    const [questions, setQuestions] = useState([]);
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        Promise.all([QuestionsAdministrationService.fetchCategories(), QuestionsAdministrationService.fetchQuestions()]).then(([categoriesResponse, questionsResponse]) => {
            setQuestions(questionsResponse.data);
            const categoriesWithQuestions = groupQuestionsByCategory(categoriesResponse.data, questionsResponse.data);
            setCategories(categoriesWithQuestions);
        });
    }, []);
    useEffect(() => {
        const categoriesWithQuestions = groupQuestionsByCategory(categories, questions);
        setCategories(categoriesWithQuestions);
    }, [questions]);
    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const questionId = parseInt(result.draggableId);
        const newCategoryId = parseInt(result.destination.droppableId);

        if (result.source.droppableId !== newCategoryId) {
            QuestionsAdministrationService.updateQuestionCategory(questionId, newCategoryId)
                .then(() => {
                    setQuestions(prevQuestions => prevQuestions.map(q => {
                        if (q.id === questionId) {
                            return {...q, category: {id: newCategoryId}};
                        }
                        return q;
                    }));

                    setCategories(prevCategories => {
                        let newCategories = [...prevCategories];
                        let movedQuestion;

                        newCategories = newCategories.map(category => {
                            if (category.id === parseInt(result.source.droppableId)) {
                                const filteredQuestions = category.questions.filter(q => q.id !== questionId);
                                return {...category, questions: filteredQuestions};
                            }
                            return category;
                        });

                        newCategories = newCategories.map(category => {
                            if (category.id === newCategoryId) {
                                movedQuestion = questions.find(q => q.id === questionId);
                                return {...category, questions: [...category.questions, movedQuestion]};
                            }
                            return category;
                        });

                        return newCategories;
                    });
                })
                .catch(error => {
                    console.error('Error updating question category:', error);
                });
        }
    };
    console.log("Categories after state update:", categories);
    return (<DragDropContext onDragEnd={onDragEnd}>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {categories.map((category, index) => {
                const isNoCategory = category.name === "No Category";
                return (<Droppable droppableId={String(category?.id)} key={category?.id}>
                    {(provided) => (<div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                            width: isNoCategory ? '100%' : '50%',
                            padding: '10px',
                            boxSizing: 'border-box',
                            borderBottom: isNoCategory ? '1px solid #ccc' : ''
                        }}
                    >
                        <h3 style={{
                            background: '#4CAF50', color: 'white', padding: '10px'
                        }}>{category?.name}</h3>
                        {category?.questions?.map((question, index) => {
                            if (!question) {
                                console.error("Undefined question found in category:", category);
                                return null;
                            }
                            return (<Draggable key={question.id} draggableId={String(question.id)}
                                               index={index}>
                                {(provided) => (<div
                                    ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <div style={{
                                        background: '#f0f0f0', margin: '5px 0', padding: '10px', borderRadius: '5px'
                                    }}>
                                        {question.name}
                                    </div>
                                </div>)}
                            </Draggable>);
                        })}
                        {provided.placeholder}
                    </div>)}
                </Droppable>);
            })}
        </div>
    </DragDropContext>);
};

const groupQuestionsByCategory = (categories, questions) => {
    const categoryMap = categories.reduce((acc, category) => {
        acc[category.id] = {...category, questions: []};
        return acc;
    }, {});

    questions.forEach(question => {
        if (!question) {
            console.error('Undefined question encountered', questions);
            return;
        }
        if (!question.category || !question.category.id) {
            console.error('Question with invalid category encountered', question);
            return;
        }
        if (categoryMap[question.category.id]) {
            categoryMap[question.category.id].questions.push(question);
        } else {
            console.error('Question with non-existent category ID encountered', question);
        }
    });

    return Object.values(categoryMap);
};

export default CategoryQuestionDragDrop;