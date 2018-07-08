function display() {
    var body = $('#main');
    body.css('background-image', 'url(img/bw-business-bubble.jpg)');

    var agentButton = $('#agent-button');
    agentButton.on('click', function() {
        odkTables.launchHTML(null, 'config/assets/agentView.html');
    })

    var coordinatorButton = $('#coordinator-button');
    coordinatorButton.on('click', function() {
        odkTables.launchHTML(null, 'config/assets/coordinatorView.html');
    })
}
