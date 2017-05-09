<?php
script('ocr', 'dist/ocradmin');
?>
<div class="section" id="ocr">
	<h2 class="icon-ocr" data-anchor-name="ocr"><?php p($l->t('OCR')) ?></h2>
	<label for="languages"><?php p($l->t('Installed languages')) ?></label><br />
	<input placeholder="eng;deu;spa;fra;deu-frak" type="text"
		name="languages" id="languages" value="<?php p($_['languages'])?>"
		style="width: 300px;"> <br />
	<em><?php p($l->t('Here goes a semicolon separated list of languages that are supported by the docker worker instance (more details in the wiki on github).')) ?></em>
	<br />
	<button type="button" id="languages_apply"><?php p($l->t('Apply')) ?></button>
	<br /> <label for="redisHost"><?php p($l->t('Redis host')) ?></label><br />
	<input placeholder="127.0.0.1" type="text" name="redisHost"
		id="redisHost" value="<?php p($_['redisHost'])?>"
		style="width: 300px;"> <br />
	<em><?php p($l->t('The host of the Redis instance for communication with the OCR worker.')) ?></em><br />
	<label for="redisPort"><?php p($l->t('Redis port')) ?></label><br /> <input
		placeholder="6379" type="number" name="redisPort" id="redisPort"
		value="<?php p($_['redisPort'])?>" style="width: 300px;"> <br />
	<em><?php p($l->t('The corresponding port (normally 6379).')) ?></em><br />
	<label for="redisDb"><?php p($l->t('Redis database')) ?></label><br />
	<input placeholder="0" type="number" name="redisDb" id="redisDb"
		value="<?php p($_['redisDb'])?>" style="width: 300px;"> <br />
	<em><?php p($l->t('The Redis database (normally 0).')) ?></em> <br />
	<button type="button" id="redis_apply"><?php p($l->t('Apply')) ?></button>
</div>