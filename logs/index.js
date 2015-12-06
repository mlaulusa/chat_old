var bunyan = require('bunyan');

module.exports = {

    setup: function (){
        var ringbuffer = new bunyan.RingBuffer(
            {
                limit: 100
            });

        app.log = bunyan.createLogger(
            {
                name: 'chat',
                streams: [
                    {
                        levels: 'error',
                        stream: process.stderr
                    },
                    {
                        levels: 'info',
                        path: 'logs/chat' + '-' + app.get('env') + ".log"
                    },
                    {
                        levels: 'trace',
                        stream: process.stdout
                    },
                    {
                        levels: 'trace',
                        type: 'raw',
                        stream: ringbuffer
                    }]
            })
    }
};
