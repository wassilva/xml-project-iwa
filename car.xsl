<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="/">
        <table id="menuTable" border="1" class="indent table table-hover">
            <thead class="thead-dark">
                <tr>
                    <th>Select</th>
                    <th>Item</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                <xsl:for-each select="dealership/carmenu/section">
                    <xsl:variable name="r_option" select="boolean(@radio)"/>
                    <xsl:variable name="item" select="@item"/>
                    <thead class="thead-light">
                        <tr class="">
                            <th colspan="3">
                                <xsl:value-of select="@name" />
                            </th>
                        </tr>
                    </thead>
                    <xsl:for-each select="entree">
                        <tr>
                            <xsl:attribute name="premium">
                                <xsl:value-of select="boolean(@premium)"/>
                            </xsl:attribute>
                            <xsl:choose>
                                <xsl:when test="$r_option = 'true'">
                                    <xsl:if test="$item = 'model'">
                                        <td align="center">
                                            <input name="model" type="radio" />
                                        </td>
                                    </xsl:if>
                                    <xsl:if test="$item = 'doors'">
                                        <td align="center">
                                            <input name="door" type="radio" />
                                        </td>
                                    </xsl:if>
                                    <xsl:if test="$item = 'car'">
                                        <td align="center">
                                            <input name="car" type="radio" />
                                        </td>
                                    </xsl:if>
                                </xsl:when>
                                <xsl:otherwise>
                                    <td align="center">
                                        <input name="item0" type="checkbox" />
                                    </td>
                                </xsl:otherwise>
                            </xsl:choose> 
                            <td>
                                <xsl:value-of select="item" />
                            </td>
                            <td align="right">
                                <xsl:value-of select="price" />
                            </td>
                        </tr>
                    </xsl:for-each>
                </xsl:for-each>
            </tbody>
        </table>
    </xsl:template>
</xsl:stylesheet>