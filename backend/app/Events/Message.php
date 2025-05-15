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

    public function __construct($message, $username)
    {
        $this->message = $message;
        $this->username = $username;
        //Log::info('Evento Message emitido', ['msg' => $message, 'user' => $username]);
    }

    public function broadcastOn(): array
    {
        return ['chat']; // canal público
    }

    public function broadcastAs()
    {
        return 'message'; // nombre del evento
    }

    public function broadcastWith()
    {
        return [
            'message' => $this->message,
            'username' => $this->username
        ];
    }
}
