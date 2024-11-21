
const API_URL = 'http://localhost:3000/loja';

document.getElementById('itemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const tipoProduto = document.getElementById('tipoProduto').value;
    const quantidade = document.getElementById('quantidade').value;
    const unidade = document.getElementById('unidade').value;

    try {
        await addItem({ tipo_produto: tipoProduto, quantidade, unidade });
        document.getElementById('itemForm').reset();
        await fetchItems();
    } catch (error) {
        console.error('Erro ao adicionar item:', error);
        alert('Erro ao adicionar item. Tente novamente.');
    }
});

async function fetchItems() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar itens');
        
        const data = await response.json();
        const itemList = document.getElementById('itemList');
        itemList.innerHTML = '';

        data.itens.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.tipo_produto} - ${item.quantidade} - ${item.unidade}`;
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Deletar';
            deleteButton.onclick = () => deleteItem(item.id);
            
            li.appendChild(deleteButton);
            itemList.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao buscar itens:', error);
        alert('Erro ao buscar itens. Tente novamente.');
    }
}

async function addItem(item) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        });
        if (!response.ok) throw new Error('Erro ao adicionar item');
    } catch (error) {
        console.error('Erro ao adicionar item:', error);
        alert('Erro ao adicionar item. Tente novamente.');
    }
}

async function deleteItem(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erro ao deletar item');
        
        await fetchItems();
    } catch (error) {
        console.error('Erro ao deletar item:', error);
        alert('Erro ao deletar item. Tente novamente.');
    }
}

fetchItems();
