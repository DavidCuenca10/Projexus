<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class Message implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $username;
    public $projectId;

    public function __construct($message, $username, $projectId)
    {
        $this->message = $message;
        $this->username = $username;
        $this->projectId  = $projectId;
        //Log::info('Evento Message emitido', ['msg' => $message, 'user' => $username, 'project' => $projectId]);
    }

    public function broadcastOn(): array
    {
        return [new Channel('chat.' . $this->projectId)]; //Chat privado para cada proyecto
    }

    public function broadcastAs()
    {
        return 'message'; // nombre del evento
    }

    public function broadcastWith()
    {
        return [
            'message' => $this->message,
            'username' => $this->username,
            'projectId' => $this->projectId,
            'timestamp' => now()->toDateTimeString()
        ];
    }
}
