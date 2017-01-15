<?php
/**
 * nextCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2016
 */

$queue = msg_get_queue(21671);
$statusqueue = msg_get_queue(27672);
$tempmsg = "1";

$msg_type = NULL;
$msg = NULL;
$max_msg_size = 512;

while (msg_receive($queue, 1, $msg_type, $max_msg_size, $msg)) {
	$workload = json_decode($msg);
	msg_send($statusqueue, 1, $tempmsg);
	if ($workload->type === 'tess') {
		//tesseract
		$command = 'tesseract "' . $workload->datadirectory . $workload->path . '" "' . $workload->tempfile . '" -l ' . $workload->language;
		$success = -1;
		exec($command, $_out, $success);
		if ($success === 0 && !isset($_out[1])) {
			//occ command which puts the file and cleans the tempfile
			exec('php ' . $workload->occdir . '/occ ocr:complete ' . $workload->statusid . ' false');
		} else {
			//update status failed.
			exec('php ' . $workload->occdir . '/occ ocr:complete ' . $workload->statusid . ' true');
		}
	} else {
		//ocrmypdf
		$command = 'ocrmypdf "' . $workload->datadirectory . $workload->path . '" "' . $workload->tempfile . '" -l ' . $workload->language . ' --skip-text';
		$success = -1;
		exec($command, $_out, $success);
		// Command successful and no error by tesseract (line[0] is 'Tesseract Open Source OCR Engine v3.03 with Leptonica' line[1] should not exist)
		if ($success === 0 && !isset($_out[0])) {
			//occ command which puts the file and cleans the tempfile
			exec('php ' . $workload->occdir . '/occ ocr:complete ' . $workload->statusid . ' false');
		} else {
			//update status failed.
			exec('php ' . $workload->occdir . '/occ ocr:complete ' . $workload->statusid . ' true');
		}
	}
	//finally, reset our msg vars for when we loop and run again
	$msg_type = NULL;
	$msg = NULL;
	msg_receive($statusqueue,1, $msg_type, $max_msg_size, $msg);
	$msg_type = NULL;
	$msg = NULL;
}