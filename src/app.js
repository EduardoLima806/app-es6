import api from './api';

export default class App {

    constructor() {
        this.repositories = [];
        this.formEl = document.getElementById('form-app');
        this.listEl = document.getElementById('repo-list');
        this.inputEl = document.querySelector('input[name=repository]');

        this.configureHandlers();
    }

    configureHandlers() {
        this.formEl.onsubmit = event => this.addRespository(event);
    }

    setLoading(loading = true) {
        if (loading === true) {
            let loadingEl = document.createElement('spam');
            loadingEl.appendChild(document.createTextNode('Carregando...'));
            loadingEl.setAttribute('id', 'loading');
            this.formEl.appendChild(loadingEl);
        } else {
            document.getElementById('loading').remove();
        }
    }

    async addRespository(event) {
        event.preventDefault();

        const repoInput = this.inputEl.value;

        if (repoInput.length === 0)
            return;

        this.setLoading();

        try {
            const result = await api.get(`/repos/${repoInput}`);
    
            const { name, description, html_url, owner: { avatar_url } } = result.data;
    
            this.repositories.push({
                name,
                description,
                avatar_url,
                html_url
            });
        } catch (error) {
            alert('Repositório não encontrado!');            
        }

        this.setLoading(false);

        this.render();
    }

    render() {

        this.listEl.innerHTML = '';
        this.repositories.forEach(repo => {
            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', repo.avatar_url);

            let titleEl = document.createElement('strong');
            titleEl.appendChild(document.createTextNode(repo.name));

            let descriptionEl = document.createElement('p');
            descriptionEl.appendChild(document.createTextNode(repo.description));

            let linkEl = document.createElement('a');
            linkEl.setAttribute('target', '_blank');
            linkEl.setAttribute('href', repo.html_url);
            linkEl.appendChild(document.createTextNode('Acessar'));

            let liListEl = document.createElement('li');
            liListEl.appendChild(imgEl);
            liListEl.appendChild(titleEl);
            liListEl.appendChild(descriptionEl);
            liListEl.appendChild(linkEl);

            this.listEl.appendChild(liListEl);
        });
    }
}