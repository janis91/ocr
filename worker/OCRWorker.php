<?php
/**
 * nextCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */

$queue = msg_get_queue(21671);
$statusqueue = msg_get_queue(27672);
$tempmsg = "1";

$msg_type = NULL;
$msg = NULL;
$max_msg_size = 512;

while (msg_receive($queue, 1, $msg_type, $max_msg_size, $msg)) {
	$workload = json_decode($msg);
	// get languages
	$languages = implode('+', $workload->languages);
	msg_send($statusqueue, 1, $tempmsg);
	if ($workload->type === 'tess') {
		//tesseract
		$command = 'tesseract "' . $workload->source . '" "' . $workload->tempfile . '" -l ' . $languages . ' 2>&1';
		$success = -1;
		exec($command, $_out, $success);
		if ($success === 0) {
			//occ command which puts the file and cleans the tempfile
			exec('php ' . $workload->occdir . '/occ ocr:complete ' . $workload->statusid . ' false');
		} else {
			//update status failed.
			$_out = preg_replace('/[^a-zA-Z0-9_]/',' ',$_out);
			exec('php ' . $workload->occdir . '/occ ocr:complete ' . $workload->statusid . ' true' . ' "Tesseract failed. Please try '. $workload->source .' manually with tesseract command to reproduce. Error (special chars escaped): ' . implode('\n', $_out) . '"');
		}
	} else {
		//ocrmypdf
		$command = 'ocrmypdf "' . $workload->source . '" "' . $workload->tempfile . '" -l ' . $languages . ' --skip-text' . ' 2>&1';
		$success = -1;
		exec($command, $_out, $success);
		if ($success === 0) {
			//occ command which puts the file and cleans the tempfile
			exec('php ' . $workload->occdir . '/occ ocr:complete ' . $workload->statusid . ' false');
		} else {
			//update status failed.
			$_out = preg_replace('/[^a-zA-Z0-9_]/',' ',$_out);
			exec('php ' . $workload->occdir . '/occ ocr:complete ' . $workload->statusid . ' true' . ' "Ocrmypdf failed. Please try '. $workload->source .' manually with ocrmypdf command to reproduce. Error (special chars escaped): ' . implode('\n', $_out) . '"');
		}
	}
	unset($_out);
	//finally, reset our msg vars for when we loop and run again
	$msg_type = NULL;
	$msg = NULL;
	msg_receive($statusqueue,1, $msg_type, $max_msg_size, $msg);
	$msg_type = NULL;
	$msg = NULL;
}