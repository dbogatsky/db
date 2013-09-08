<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
//! Description
/**
* @date 08.09.13 12:03
* @version 0.1
* @author Dmitry Bogatsky dbogatsky@gmail.com
*/
class Questions_model extends CI_Model {

	function get_all()
    {
        $query = $this->db->get('questions', 10);
        return $query->result();
    }

 }
