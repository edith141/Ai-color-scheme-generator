    const app = new Clarifai.App({
        apiKey: '1736e6d7ad5d4903827dd5e7f8d1ebf3'
    });

    // Use Clarifai to find the image color scheme
    function getColors(file) {
        app.models.predict(Clarifai.COLOR_MODEL, {base64: file}).then(
            // Response handler
            function (response) {
                // Get colors from response and sort by descending prevalence
                const colors = response.outputs[0].data.colors;
                colors.sort((a, b) => (a.value > b.value) ? -1 : ((b.value > a.value) ? 1 : 0));

                const holder = document.querySelector('#colors');
                holder.innerHTML = '';

                for (let i = 0; i < colors.length; i++) {
                    const color = colors[i];
                    console.log(i)

                    // div for new pallete
                    const addition = `
                        <div id = "${i}"><span>
                        ${color.raw_hex} </span><span>
                        ${color.w3c.name} </span><span>
                        ${color.value} </span></div>
                    `;

                    holder.innerHTML += addition;

                    //DOESN'T WORK
                    // document.querySelector(`#${i}`).style.backgroundColor = color.raw_hex;
                    //WORKS FINE
                    document.getElementById(i).style.backgroundColor = color.raw_hex;

                    if (tinycolor(color.raw_hex).isLight()) {
                        document.getElementById(i).style.color = 'black';
                    }

                    
                }
            },
            // Error handler
            function (err) {
                console.error(err);
            }
        );
    }

    // Image upload handler
    const processImg = () => {
        const file = document.querySelector('input[type=file]').files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function () {
            $('.bg-image').css('background-image', 'url("' + reader.result + '")');
            $('#colors').html('<h2>Processing...</h2>');

            getColors(reader.result.substr(reader.result.search('base64,') + 7));
        };

        reader.onerror = function (error) {
            console.error('Error: ', error);
        };

    };
