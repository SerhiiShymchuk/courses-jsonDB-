const converter = (price) => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(price)
};

//ініціалізація табів авторизації
const instance = M.Tabs.init(document.querySelectorAll('.tabs'));

[...document.querySelectorAll('.price')].forEach(node => {
    node.innerText = converter(node.innerText)
})

if(location.href.endsWith('/card')) {
    const $card = document.querySelector('#card')
    $card.addEventListener('click', (e) => {
        if (e.target.classList.contains('js-remove')) {
            console.log(e.target)
            const id = e.target.dataset.id
            const csrf = e.target.dataset.csrf
            fetch(`/card/remove/${id}`, {
                method: 'DELETE',
                headers: {'X-XSRF-TOKEN': csrf,}
            }).then(res => res.json())
            .then(card => {
                if (card.courses.length) {
                    const tbody = $card.querySelector('tbody')
                    const html = card.courses.map(c => {
                        return `
                        <tr>
                            <td>${c.title}</td>
                            <td>${c.count}</td>
                            <td>
                                <button class="btn btn-small js-remove" data-id="${c.id}">Видалити</button>
                            </td>
                        </tr>
                    `
                    })
                    tbody.innerHTML = html.join('')
                    $card.querySelector('.price').innerText = converter(card.price)
                } else {
                    $card.innerHTML = `<p>Кошик пустий</p>`
                }
            })
        }
    })
}