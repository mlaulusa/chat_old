var bunyan = require('bunyan');

module.exports = {

    setup: function (){
        var ringbuffer = new bunyan.RingBuffer(
            {
                limit: 100
            });

        app.log = bunyan.createLogger({
                name: 'chat',
                streams: [
                    {
                        level: 'error',
                        stream: process.stderr
                    },
                    {
                        level: 'info',
                        path: 'logs/chat' + '-' + app.get('env') + ".log"
                    },
                    {
                        level: 'trace',
                        stream: process.stdout
                    },
                    {
                        level: 'trace',
                        type: 'raw',
                        stream: ringbuffer
                    }]
            });

    }
};
