<?php

$worker = new GearmanWorker();
$worker->addServer('127.0.0.1',4730);

$worker->addFunction(/**
					 * @param GearmanJob $job
					 */
	"ocr", function(GearmanJob $job) {
	$workload = json_decode($job->workload());
	if($workload->type == 'tess'){
		//tesseract
		$command = 'tesseract "' . $workload->datadirectory . $workload->path . '" "' . $workload->tempfile . '" -l ' . $workload->language;
		$success = -1;
		exec($command, $_out, $success);
		if ($success == 0 && !isset($_out[1])) {
			//occ command which puts the file and cleans the tempfile
			exec('php '.$workload->occdir.'/occ ocr:complete '.$workload->statusid.' false');
		}else{
			//update status failed.
			exec('php '.$workload->occdir.'/occ ocr:complete '.$workload->statusid.' true');
		}
	}else{
		//ocrmypdf
		$command = 'ocrmypdf "' . $workload->datadirectory . $workload->path . '" "' . $workload->tempfile . '" -l ' . $workload->language . ' --skip-text';
		$success = -1;
		exec($command, $_out, $success);
		// Command successful and no error by tesseract (line[0] is 'Tesseract Open Source OCR Engine v3.03 with Leptonica' line[1] should not exist)
		if ($success == 0 && !isset($_out[0])) {
			//occ command which puts the file and cleans the tempfile
			exec('php '.$workload->occdir.'/occ ocr:complete '.$workload->statusid.' false');
		}else{
			//update status failed.
			exec('php '.$workload->occdir.'/occ ocr:complete '.$workload->statusid.' true');
		}
	}
});

while ($worker->work());