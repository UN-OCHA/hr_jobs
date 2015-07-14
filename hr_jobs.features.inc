<?php
/**
 * @file
 * hid_profiles.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function hr_jobs_ctools_plugin_api($module = NULL, $api = NULL) {
  if ($module == "context" && $api == "context") {
    return array("version" => "3");
  }
}