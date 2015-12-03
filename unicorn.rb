app_dir = File.expand_path(File.dirname(__FILE__))
pid File.join(app_dir, 'tmp/pids/unicorn.pid')
stderr_path File.join(app_dir, 'log/unicorn.log')

worker_processes 4
listen 4567 

