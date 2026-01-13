async function FetchJSON() {
    try {
        const respond = await fetch('data.json');

        if (!respond.ok) throw new Error("Can't fetch data! Is the path to JSON wrong?");

        const data = await respond.json();
        const container = document.getElementById("contentDisplay");
        
        const shopHTML = data.map(item => {
            const isInStock = item.stock > 0;
            const statusText = isInStock ? `In stock (${item.stock})` : 'Out of stock';

            return `
                <div class="containers">
                    <div class="ctext">
                        <h1>${item.item}</h1>
                        <h2>${item.price}</h2>
                        <div class="scontainers">
                            <div class="status">
                                <h2>Status : ${statusText}</h2>
                            </div>
                        </div>
                        <br>
                    </div>
                </div>
                <br>
                <br>`;
        }).join('');

        container.innerHTML = shopHTML;

        const newContainers = container.querySelectorAll('.containers');

        newContainers.forEach((el, index) => {
            el.animate(
                [
                    {   opacity: 0,
                        transform: 'translateY(20px)'
                    },
                    {   opacity: 1,
                        transform: 'translateY(0px)'
                    }
                ], 
                {
                    duration: 500, 
                    easing: 'linear',
                    fill: 'forwards', 
                    delay: index * 100 
                }
            );
        });

    } catch (error) {
        console.error('Error! We can\'t fetch data sorry!: ', error);
    }
}

FetchJSON();
