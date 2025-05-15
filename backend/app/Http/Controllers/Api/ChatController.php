<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Events\Message;

class ChatController extends Controller
{
    public function message(Request $request)
    {
        event(new Message($request->input('message'), $request->input('username'), $request->input('project_id')));

        return response()->json(['status' => 'Mensaje enviado']);
    }
}
