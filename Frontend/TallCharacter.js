/*:
 * @plugindesc Membuat sprite karakter lebih tinggi dan ramping (tidak chibi)
 * @author Claude
 *
 * @param Height Scale
 * @desc Skala tinggi karakter. Default 1.4 (40% lebih tinggi)
 * @default 1.4
 *
 * @param Width Scale
 * @desc Skala lebar karakter. Default 0.85 (sedikit lebih ramping)
 * @default 0.85
 *
 * @help
 * Pasang plugin ini dan karakter akan otomatis jadi lebih tinggi & ramping.
 * Tidak perlu setting tambahan.
 */

(function() {
    var parameters = PluginManager.parameters('TallCharacter');
    var heightScale = parseFloat(parameters['Height Scale'] || 1.4);
    var widthScale  = parseFloat(parameters['Width Scale']  || 0.85);

    var _Sprite_Character_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.call(this);    
        this.scale.y = heightScale;
        this.scale.x = widthScale;
    };
})();