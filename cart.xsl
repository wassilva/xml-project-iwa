<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="/">
        <table id="menuTable" border="1" class="indent table table-hover">
            <thead class="thead-light">
                <tr>
                    <th>Selected</th>
                    <th>Item</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                <xsl:for-each select="cart/section/entree">
                    <xsl:variable name="content" select="item"/>
                    <xsl:if test="$content!=''">
                        <tr>
                            <td>
                                <xsl:value-of select="item"/>
                            </td>
                            <td class="prices">
                                <xsl:value-of select="price"/>
                            </td>
                        </tr>
                    </xsl:if>
                </xsl:for-each>
            </tbody>
        </table>
    </xsl:template>
</xsl:stylesheet>