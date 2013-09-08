<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class First extends CI_Controller {

	public function index()
	{
		$this->load->model('questions_model');
		$questions = $this->questions_model->get_all();
		print_r($questions); exit;
		$this->load->view('index_message');
	}
}