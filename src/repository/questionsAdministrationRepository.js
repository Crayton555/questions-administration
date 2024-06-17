import axios from "../custom-axios/axios";

const QuestionsAdministrationService = {
    fetchLabels: () => {
        return axios.get("/labels");
    },
    getLabel: (id) => {
        return axios.get(`/labels/${id}`);
    },
    addLabel: (name, questionIds) => {
        return axios.post("/labels/add", {
            "name": name,
            "questionIds": questionIds
        });
    },
    editLabel: (id, name, questionIds) => {
        return axios.put(`/labels/edit/${id}`, {
            "name": name,
            "questionIds": questionIds
        });
    },
    deleteLabel: (id) => {
        return axios.delete(`/labels/delete/${id}`);
    },

    fetchCategories: () => {
        return axios.get("/categories");
    },
    getCategory: (id) => {
        return axios.get(`/categories/${id}`);
    },
    addCategory: (category) => {
        return axios.post("/categories/add", {
            "name": category.name,
            "info": category.info,
            "infoTextFormat": category.infoTextFormat,
            "idNumber": category.idNumber,
            "parentId": category.parentId,
            "questionIds": category.questionIds
        });
    },
    editCategory: (id, category) => {
        return axios.put(`/categories/edit/${id}`, {
            "name": category.name,
            "info": category.info,
            "infoTextFormat": category.infoTextFormat,
            "idNumber": category.idNumber,
            "parentId": category.parentId,
            "questionIds": category.questionIds
        });
    },
    deleteCategory: (id) => {
        return axios.delete(`/categories/delete/${id}`);
    },

    fetchQuestions: () => {
        return axios.get("/questions");
    },
    getQuestion: (id) => {
        return axios.get(`/questions/${id}`);
    },
    deleteQuestion: (id) => {
        return axios.delete(`/questions/delete/${id}`);
    },
    getAllQuestionsByCategory: (id) => {
        return axios.get(`/categories/${id}/questions`);
    },
    fetchCategoriesWithQuestions: () => {
        return axios.get("/categories/categories-with-questions");
    },
    addQuestion: (questionWrapper) => {
        return axios.post("/questions/add", questionWrapper);
    },
    editQuestion: (id, questionWrapper) => {
        return axios.put(`/questions/edit/${id}`, questionWrapper);
    },
    updateQuestionCategory: (questionId, newCategoryId) => {
        return axios.put(`/questions/${questionId}/change-question-category/${newCategoryId}`);
    },
    addNewLabelToQuestion: (questionId, labelDto) => {
        return axios.post(`/questions/${questionId}/labels`, labelDto);
    },
    uploadQuestionFile: (file) => {
        let formData = new FormData();
        formData.append('file', file);
        return axios.post("/questions/upload-xml", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },
    exportData: () => {
        return axios.get("/questions/export/xml", { responseType: 'blob' });
    }
}

export default QuestionsAdministrationService;