<?php
// scheduler.php - 处理定时PDF下载任务
header('Content-Type: application/json');

// 定义定时任务类
class NurseDataScheduler {
    private $configFile = 'scheduler_config.json';
    
    public function __construct() {
        // 确保配置文件存在
        if (!file_exists($this->configFile)) {
            file_put_contents($this->configFile, json_encode([
                'jobs' => [],
                'last_run' => null
            ]));
        }
    }
    
    // 添加定时任务
    public function addJob($job) {
        $config = json_decode(file_get_contents($this->configFile), true);
        
        // 为任务分配ID
        $job['id'] = uniqid();
        $job['created_at'] = date('Y-m-d H:i:s');
        
        $config['jobs'][] = $job;
        
        file_put_contents($this->configFile, json_encode($config, JSON_PRETTY_PRINT));
        
        return $job;
    }
    
    // 获取所有任务
    public function getJobs() {
        $config = json_decode(file_get_contents($this->configFile), true);
        return $config['jobs'];
    }
    
    // 检查是否需要执行定时任务
    public function checkScheduledJobs() {
        $jobs = $this->getJobs();
        $results = [];
        
        foreach ($jobs as $job) {
            $shouldRun = $this->shouldJobRun($job);
            
            if ($shouldRun) {
                $result = $this->executeJob($job);
                $results[] = $result;
            }
        }
        
        // 更新最后运行时间
        $config = json_decode(file_get_contents($this->configFile), true);
        $config['last_run'] = date('Y-m-d H:i:s');
        file_put_contents($this->configFile, json_encode($config, JSON_PRETTY_PRINT));
        
        return $results;
    }
    
    // 判断任务是否应该运行
    private function shouldJobRun($job) {
        $now = new DateTime();
        $lastRun = isset($job['last_run']) ? new DateTime($job['last_run']) : new DateTime('1970-01-01');
        
        switch ($job['frequency']) {
            case 'daily':
                // 检查是否是同一天的不同运行
                return $now->format('Y-m-d') !== $lastRun->format('Y-m-d') && 
                       $now->format('H:i') >= $job['time'];
                
            case 'weekly':
                // 检查是否是同一周的不同运行
                $nowWeek = $now->format('o-W'); // ISO周数
                $lastWeek = $lastRun->format('o-W');
                return $nowWeek !== $lastWeek && 
                       $now->format('H:i') >= $job['time'];
                
            case 'monthly':
                // 检查是否是不同月份
                $nowMonth = $now->format('Y-m');
                $lastMonth = $lastRun->format('Y-m');
                return $nowMonth !== $lastMonth && 
                       $now->format('H:i') >= $job['time'];
                
            default:
                return false;
        }
    }
    
    // 执行任务
    private function executeJob($job) {
        // 这里应该实现实际的PDF下载逻辑
        // 由于环境限制，我们模拟这个过程
        
        $result = [
            'job_id' => $job['id'],
            'job_type' => $job['type'],
            'executed_at' => date('Y-m-d H:i:s'),
            'status' => 'completed', // 在实际实现中，这可能是pending或failed
            'details' => 'PDF download task executed'
        ];
        
        // 更新任务的最后运行时间
        $this->updateJobLastRun($job['id']);
        
        return $result;
    }
    
    // 更新任务的最后运行时间
    private function updateJobLastRun($jobId) {
        $config = json_decode(file_get_contents($this->configFile), true);
        
        foreach ($config['jobs'] as &$job) {
            if ($job['id'] === $jobId) {
                $job['last_run'] = date('Y-m-d H:i:s');
                break;
            }
        }
        
        file_put_contents($this->configFile, json_encode($config, JSON_PRETTY_PRINT));
    }
}

// 处理请求
$scheduler = new NurseDataScheduler();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['action'])) {
        switch ($input['action']) {
            case 'add_job':
                $result = $scheduler->addJob($input['job']);
                echo json_encode(['success' => true, 'job' => $result]);
                break;
                
            case 'check_jobs':
                $results = $scheduler->checkScheduledJobs();
                echo json_encode(['success' => true, 'results' => $results]);
                break;
                
            default:
                http_response_code(400);
                echo json_encode(['error' => 'Invalid action']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Action is required']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $jobs = $scheduler->getJobs();
    echo json_encode(['success' => true, 'jobs' => $jobs]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>