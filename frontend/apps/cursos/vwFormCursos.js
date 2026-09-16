document.addEventListener('DOMContentLoaded', async function () {
    if (!dw3IsLogged()) {
        return;
    }

    var form = document.getElementById('frmCursos');

    if (!form) {
        return;
    }

    var parametros = new URLSearchParams(window.location.search);
    var oper = parametros.get('oper') || parametros.get('Oper');
    var servidorDw3 = form.dataset.servidorDw3;
    var btnInserir = document.getElementById('btnInserirCurso');
    var btnAtualizar = document.getElementById('btnAtualizarCurso');

    if (oper === 'Cr') {
        btnInserir.classList.remove('d-none');
    }

    if (oper === 'Re') {
        vwGetCursoByID();
    }

    if (oper === 'Up') {
        btnAtualizar.classList.remove('d-none');
        btnAtualizar.disabled = !(await vwGetCursoByID());
        btnAtualizar.addEventListener('click', function () {
            vwUpdateCurso();
        });
    }

    if (oper === 'De') {
        var btnRemover = document.getElementById('btnRemoverCurso');
        btnRemover.classList.remove('d-none');
        btnRemover.disabled = !(await vwGetCursoByID());
        btnRemover.addEventListener('click', function () {
            vwDeleteCurso();
        });
    }

    if (btnInserir) {
        btnInserir.addEventListener('click', function () {
            vwInsertCurso();
        });
    }
});

async function vwInsertCurso() {
    var form = document.getElementById('frmCursos');
    var btnInserir = document.getElementById('btnInserirCurso');

    try {
        if (!form.reportValidity()) {
            return;
        }

        var servidorDw3 = form.dataset.servidorDw3;

        if (!servidorDw3) {
            throw new Error('Endereco do servidor backend nao configurado.');
        }

        if (btnInserir) {
            btnInserir.disabled = true;
        }

        var response = await fetch(servidorDw3 + '/insertCurso', {
            method: 'POST',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(montarCursoDoFormulario())
        });

        if (!response.ok) {
            throw new Error('Nao foi possivel inserir o curso.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Nao foi possivel inserir o curso.');
        }

        window.location.href = '/cursos';
    } catch (error) {
        alert(error.message || 'Erro ao inserir curso.');
    } finally {
        if (btnInserir) {
            btnInserir.disabled = false;
        }
    }
}

async function vwGetCursoByID() {
    var form = document.getElementById('frmCursos');

    try {
        var parametros = new URLSearchParams(window.location.search);
        var cursoId = parametros.get('cursoId');
        var servidorDw3 = form.dataset.servidorDw3;

        if (!cursoId || !/^\d+$/.test(cursoId) || Number(cursoId) <= 0) {
            throw new Error('ID do curso invalido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereco do servidor backend nao configurado.');
        }

        var response = await fetch(servidorDw3 + '/getCursoByID/' + encodeURIComponent(cursoId), {
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            })
        });

        if (!response.ok) {
            throw new Error('Nao foi possivel carregar o curso.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
        }

        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta invalida do servidor backend.');
        }

        var curso = data.registro[0];

        if (!curso) {
            throw new Error('Curso nao encontrado.');
        }

        document.getElementById('cursoid').value = curso.cursoid;
        document.getElementById('codigo').value = curso.codigo ?? '';
        document.getElementById('descricao').value = curso.descricao ?? '';
        document.getElementById('ativo').checked = curso.ativo === true || curso.ativo === 'true';
        document.getElementById('deleted').value = String(curso.deleted === true);

        return true;
    } catch (error) {
        alert(error.message || 'Erro ao carregar curso.');
        return false;
    }
}

async function vwUpdateCurso() {
    var form = document.getElementById('frmCursos');
    var btnAtualizar = document.getElementById('btnAtualizarCurso');

    if (btnAtualizar.disabled || !form.reportValidity()) {
        return;
    }

    try {
        var cursoId = new URLSearchParams(window.location.search).get('cursoId');
        var servidorDw3 = form.dataset.servidorDw3;

        if (!cursoId || !/^\d+$/.test(cursoId) || Number(cursoId) <= 0) {
            throw new Error('ID do curso invalido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereco do servidor backend nao configurado.');
        }

        btnAtualizar.disabled = true;

        var curso = montarCursoDoFormulario();
        curso.ativo = Boolean(curso.ativo);

        var response = await fetch(servidorDw3 + '/updateCurso/' + encodeURIComponent(cursoId), {
            method: 'PUT',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(curso)
        });

        if (!response.ok) {
            throw new Error('Nao foi possivel atualizar o curso.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Nao foi possivel atualizar o curso.');
        }

        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhum curso foi atualizado.');
        }

        alert('Curso atualizado com sucesso.');
    } catch (error) {
        alert(error.message || 'Erro ao atualizar curso.');
    } finally {
        btnAtualizar.disabled = false;
    }
}

async function vwDeleteCurso() {
    var form = document.getElementById('frmCursos');
    var btnRemover = document.getElementById('btnRemoverCurso');

    if (btnRemover.disabled) {
        return;
    }

    if (!window.confirm('Confirma a remoção deste curso?')) {
        return;
    }

    try {
        var cursoId = document.getElementById('cursoid').value;
        var servidorDw3 = form.dataset.servidorDw3;

        if (!cursoId || !/^\d+$/.test(cursoId) || Number(cursoId) <= 0) {
            throw new Error('ID do curso invalido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereco do servidor backend nao configurado.');
        }

        btnRemover.disabled = true;

        var response = await fetch(servidorDw3 + '/deleteCurso/' + encodeURIComponent(cursoId), {
            method: 'DELETE',
            headers: dw3MontarHeadersAutenticacao()
        });

        if (!response.ok) {
            throw new Error('Nao foi possivel remover o curso.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Nao foi possivel remover o curso.');
        }

        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhum curso foi removido.');
        }

        window.location.href = '/cursos';
    } catch (error) {
        alert(error.message || 'Erro ao remover curso.');
    } finally {
        btnRemover.disabled = false;
    }
}

function montarCursoDoFormulario() {
    return {
        codigo: document.getElementById('codigo').value,
        descricao: document.getElementById('descricao').value,
        ativo: document.getElementById('ativo').checked,
        deleted: document.getElementById('deleted').value === 'true'
    };
}
